import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { applyConfig, resolveOutputPath } from './apply-config';
import { FerolyteProfileConfig } from './interfaces/config';

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'ferolyte-apply-config-'));
  await writeFile(join(dir, 'tsconfig.json'), '{ "compilerOptions": {} }');
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

const profile = (output?: string): FerolyteProfileConfig =>
  ({
    tsconfig: join(dir, 'tsconfig.json'),
    packs: { alias: 'cool', namespace: 'cool', output },
  }) as FerolyteProfileConfig;

describe('packs.output', () => {
  it('writes into an absolute directory', async () => {
    const target = join(dir, 'out');
    await applyConfig(profile(target));

    expect(BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH).toBe(join(target, 'COOL_BP'));
    expect(BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH).toBe(join(target, 'COOL_RP'));
  });

  it('resolves a relative directory against the working directory', async () => {
    await applyConfig(profile('../packs-out'));

    expect(BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH).toBe(
      join(resolve(process.cwd(), '../packs-out'), 'COOL_BP'),
    );
  });

  it('treats `custom` as a directory name', async () => {
    await applyConfig(profile('custom'));

    expect(BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH).toBe(
      join(process.cwd(), 'custom', 'COOL_RP'),
    );
  });

  it('keeps the presets', async () => {
    await applyConfig(profile('build'));

    expect(BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH).toBe(
      join(process.cwd(), 'build', 'COOL_BP'),
    );
  });

  it('rejects an empty value naming the presets', () => {
    expect(() => resolveOutputPath('  ', { build: () => '' }, dir)).toThrow(
      /Use a preset \(build\) or a directory path/,
    );
  });
});
