import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { clearGraph } from '../core/graph';
import { INSPECT_EXIT, inspectContentFile } from './inspect-file';

const repoPackages = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

let root: string;
let previousCwd: string;

const write = async (relativePath: string, content: string) => {
  const path = join(root, relativePath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);

  return path;
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-inspect-'));
  previousCwd = process.cwd();
  process.chdir(root);
  await write('tsconfig.json', '{"compilerOptions":{}}');
  BUILD_CONTEXT.TS.CONFIG_PATH = join(root, 'tsconfig.json');
  BUILD_CONTEXT.TS.ALIASES = {
    '@ferolyte/pack': join(repoPackages, 'pack'),
    '@ferolyte/common': join(repoPackages, 'common'),
    '@common': join(root, 'src/common'),
  };
  BUILD_CONTEXT.PACKS.CACHE_PATH = join(root, '.cache');
});

afterEach(async () => {
  process.chdir(previousCwd);
  BUILD_CONTEXT.TS.ALIASES = {};
  clearGraph();
  await rm(root, { recursive: true, force: true });
});

const entityTs = (identifier: string) => `
import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import { NAME } from '@common/names';
import { world } from '@minecraft/server';

export default new ClientEntityBuilder({
  identifier: '${identifier}',
  animations: { walk: 'animation.' + NAME + '.walk' },
  scripts: { animate: ['walk'] },
  extra: typeof world,
} as any);
`;

describe('inspectContentFile', () => {
  it('prints client entity JSON using aliases and stubbed @minecraft modules', async () => {
    await write('src/common/names.ts', "export const NAME = 'cow';");
    const file = await write('RP/entity/cow.ce.ts', entityTs('test:cow'));

    const result = await inspectContentFile(file);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const json = result.json as any;
    expect(json['minecraft:client_entity'].description.identifier).toBe('test:cow');
    expect(json['minecraft:client_entity'].description.animations).toEqual({
      walk: 'animation.cow.walk',
    });
  });

  it('returns an array for multi-builder files', async () => {
    const source = entityTs('test:a').replace(
      /export default (new ClientEntityBuilder\([\s\S]*\));/,
      (_, builder: string) =>
        `export default [${builder}, ${builder.replace('test:a', 'test:b')}];`,
    );
    const file = await write('RP/entity/multi.ce.ts', source);
    await write('src/common/names.ts', "export const NAME = 'm';");

    const result = await inspectContentFile(file);

    expect(result.ok).toBe(true);
    expect(Array.isArray(result.ok && result.json)).toBe(true);
  });

  it('exit code 2 for a missing file, 1 for broken source', async () => {
    const missing = await inspectContentFile(join(root, 'nope.ce.ts'));
    expect(missing).toMatchObject({ ok: false, code: INSPECT_EXIT.USAGE });

    const broken = await write('RP/entity/bad.ce.ts', 'export default {');
    expect(await inspectContentFile(broken)).toMatchObject({
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
    });

    const empty = await write('RP/entity/empty.ce.ts', 'export const x = 1;');
    expect(await inspectContentFile(empty)).toMatchObject({
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
    });
  });
});
