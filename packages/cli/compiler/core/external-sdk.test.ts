import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { bundleEntries, clearExternalModules, evaluateBundle } from './bundle';
import { clearGraph } from './graph';

let root: string;
let previousCwd: string;

const write = async (path: string, content: string) => {
  const file = join(root, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);

  return file;
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-external-'));
  previousCwd = process.cwd();
  process.chdir(root);
  clearGraph();
  clearExternalModules();
  BUILD_CONTEXT.TS.ALIASES = {};
  BUILD_CONTEXT.TS.CONFIG_PATH = await write('tsconfig.json', '{"compilerOptions":{}}');
  BUILD_CONTEXT.PACKS.CACHE_PATH = join(root, '.cache');

  // A fake ESM SDK that counts how often it is evaluated.
  await write('package.json', '{"name":"project"}');
  await write(
    'node_modules/@ferolyte/pack/package.json',
    JSON.stringify({
      name: '@ferolyte/pack',
      type: 'module',
      exports: { '.': { default: './index.js' }, './*': { default: './*.js' } },
    }),
  );
  await write(
    'node_modules/@ferolyte/pack/index.js',
    "globalThis.__sdkLoads = (globalThis.__sdkLoads ?? 0) + 1;\nexport class Builder { constructor(id) { this.id = id; } }\nexport const createThing = (id) => new Builder(id);\nexport default { marker: 'default' };\n",
  );
  await write('node_modules/@ferolyte/pack/extra.js', 'export const extra = 42;\n');
});

afterEach(async () => {
  process.chdir(previousCwd);
  delete (globalThis as { __sdkLoads?: number }).__sdkLoads;
  clearGraph();
  await rm(root, { recursive: true, force: true });
});

describe('external SDK', () => {
  it('does not bundle @ferolyte/pack and shares one instance across entries', async () => {
    const a = await write(
      'packs/BP/a.item.ts',
      "import { Builder, createThing } from '@ferolyte/pack'; import { extra } from '@ferolyte/pack/extra'; export default { Builder, thing: createThing('a'), extra };",
    );
    const b = await write(
      'packs/BP/b.item.ts',
      "import { Builder, createThing } from '@ferolyte/pack'; export default { Builder, thing: createThing('b') };",
    );

    const { bundled, failed } = await bundleEntries([a, b]);

    expect(failed).toEqual([]);
    expect(bundled.every((entry) => !entry.code.includes('class Builder'))).toBe(true);
    expect([...bundled[0].externals].sort()).toEqual(['@ferolyte/pack', '@ferolyte/pack/extra'].filter((s) => bundled[0].externals.has(s)));

    const results = bundled.map(
      (entry) => evaluateBundle(entry.code, entry.entry) as { default: any },
    );

    // one module instance: same class, instanceof works across entries, loaded once
    expect(results[0].default.Builder).toBe(results[1].default.Builder);
    expect(results[0].default.thing).toBeInstanceOf(results[1].default.Builder);
    expect((globalThis as { __sdkLoads?: number }).__sdkLoads).toBe(1);
    expect(results.find((r) => r.default.extra)?.default.extra).toBe(42);
  });

  it('keeps bundling the SDK when tsconfig paths map it to sources', async () => {
    await write('src-sdk/index.ts', "export const createThing = (id: string) => ({ id });");
    BUILD_CONTEXT.TS.ALIASES = { '@ferolyte/pack': join(root, 'src-sdk/index.ts') };
    const a = await write(
      'packs/BP/a.item.ts',
      "import { createThing } from '@ferolyte/pack'; export default createThing('a');",
    );

    const { bundled, failed } = await bundleEntries([a]);

    expect(failed).toEqual([]);
    expect(bundled[0].externals.size).toBe(0);
    expect(bundled[0].code).toContain('createThing');
  });
});
