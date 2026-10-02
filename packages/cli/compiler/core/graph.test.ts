import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { getExtraWatchedInputs } from '../actions/watch';
import { bundleEntries, evaluateBundle } from './bundle';
import { getAffectedEntries } from './builder';
import { clearGraph, getDependentEntries, removeEntry } from './graph';

let root: string;
let previousCwd: string;

const write = async (relativePath: string, content: string) => {
  const path = join(root, relativePath);
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, content);

  return resolve(path);
};

const sorted = (values: Iterable<string>) => [...values].sort();

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-graph-'));
  previousCwd = process.cwd();
  process.chdir(root);
  clearGraph();

  await write('tsconfig.json', '{"compilerOptions":{}}');
  BUILD_CONTEXT.TS.CONFIG_PATH = join(root, 'tsconfig.json');
  BUILD_CONTEXT.TS.ALIASES = { '@common': join(root, 'src/common') };
  BUILD_CONTEXT.PACKS.CACHE_PATH = join(root, '.cache');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'packs/BP');
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'packs/RP');
});

afterEach(async () => {
  process.chdir(previousCwd);
  BUILD_CONTEXT.TS.ALIASES = {};
  clearGraph();
  await rm(root, { recursive: true, force: true });
});

describe('dependency graph', () => {
  it('links every entry to the shared file it imports', async () => {
    const shared = await write('src/common/shared.ts', 'export const x = 1;');
    const a = await write(
      'packs/BP/a.se.ts',
      "import { x } from '@common/shared'; export default { x };",
    );
    const b = await write(
      'packs/BP/b.se.ts',
      "import { x } from '@common/shared'; export default { x };",
    );

    const { bundled, failed } = await bundleEntries([a, b]);

    expect(failed).toEqual([]);
    expect(bundled).toHaveLength(2);
    expect(sorted(getDependentEntries(shared))).toEqual(sorted([a, b]));
    expect(sorted(getAffectedEntries([shared]))).toEqual(sorted([a, b]));
  });

  it('keeps the old entry linked when a new entry imports the same file', async () => {
    const shared = await write('src/common/shared.ts', 'export const x = 1;');
    const a = await write(
      'packs/BP/a.se.ts',
      "import { x } from '@common/shared'; export default { x };",
    );
    await bundleEntries([a]);

    const c = await write(
      'packs/BP/c.se.ts',
      "import { x } from '@common/shared'; export default { x };",
    );
    await bundleEntries([c]);

    expect(sorted(getDependentEntries(shared))).toEqual(sorted([a, c]));
  });

  it('rescans imports of a known entry', async () => {
    const extra = await write('src/common/extra.ts', 'export const y = 2;');
    const a = await write('packs/BP/a.se.ts', 'export default { x: 1 };');
    await bundleEntries([a]);
    expect(getDependentEntries(extra).size).toBe(0);

    await write(
      'packs/BP/a.se.ts',
      "import { y } from '@common/extra'; export default { y };",
    );
    await bundleEntries([a]);
    expect([...getDependentEntries(extra)]).toEqual([a]);

    await write('packs/BP/a.se.ts', 'export default { x: 1 };');
    await bundleEntries([a]);
    expect(getDependentEntries(extra).size).toBe(0);
  });

  it('treats an imported JSON file as a dependency', async () => {
    const json = await write('packs/BP/data.json', '{ /* c */ "n": 3 }');
    const a = await write(
      'packs/BP/a.se.ts',
      "import data from './data.json'; export default { n: data.n };",
    );

    const { bundled } = await bundleEntries([a]);

    expect([...getAffectedEntries([json])]).toEqual([a]);
    expect(evaluateBundle(bundled[0].code, a)).toMatchObject({
      default: { n: 3 },
    });
  });

  it('watches inputs outside of the pack folders', async () => {
    const shared = await write('src/common/shared.ts', 'export const x = 1;');
    const inside = await write('packs/BP/helper.ts', 'export const h = 1;');
    const a = await write(
      'packs/BP/a.se.ts',
      "import { x } from '@common/shared'; import { h } from './helper'; export default { x, h };",
    );
    await bundleEntries([a]);

    const extra = getExtraWatchedInputs([
      BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
      BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
    ]);

    expect(extra.has(shared)).toBe(true);
    expect(extra.has(inside)).toBe(false);
    expect(extra.has(a)).toBe(false);
  });

  it('isolates a broken entry from the rest of the batch', async () => {
    const good = await write('packs/BP/a.se.ts', 'export default { ok: 1 };');
    const bad = await write('packs/BP/b.se.ts', 'export default {');

    const { bundled, failed } = await bundleEntries([good, bad]);

    expect(bundled.map((entry) => entry.entry)).toEqual([good]);
    expect(failed.map((entry) => entry.entry)).toEqual([bad]);
  });

  it('removes entries from the reverse index', async () => {
    const shared = await write('src/common/shared.ts', 'export const x = 1;');
    const a = await write(
      'packs/BP/a.se.ts',
      "import { x } from '@common/shared'; export default { x };",
    );
    await bundleEntries([a]);

    removeEntry(a);

    expect(getDependentEntries(shared).size).toBe(0);
  });
});
