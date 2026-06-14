import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../../build-context';
import {
  clearItemTextureRegistry,
  flushItemTextures,
  loadItemTextureBase,
  registerItemTexture,
} from './item-texture-atlas';

const tempRoots: string[] = [];

const createTempRoot = async (): Promise<string> => {
  const root = join(
    tmpdir(),
    `artifex-item-texture-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  await mkdir(root, { recursive: true });
  tempRoots.push(root);
  return root;
};

const setupBuildContext = (root: string) => {
  BUILD_CONTEXT.PACKS.INPUT_BASE_PATH = root;
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'out', 'RP');
  BUILD_CONTEXT.PACKS.NAMESPACE = 'arfex_test';
  BUILD_CONTEXT.PACKS.MINIFY_JSON = false;
};

describe('item-texture-atlas', () => {
  beforeEach(() => {
    clearItemTextureRegistry();
  });

  afterEach(async () => {
    await Promise.all(
      tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
    );
  });

  it('loads base atlas from RP textures input', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'RP', 'textures'), { recursive: true });

    await writeFile(
      join(root, 'RP', 'textures', 'item_texture.json'),
      JSON.stringify({
        resource_pack_name: 'arfex_test',
        texture_name: 'atlas.items',
        texture_data: {
          'manual:entry': { textures: 'textures/manual' },
        },
      }),
      'utf-8',
    );

    const base = await loadItemTextureBase();

    expect(base.texture_data['manual:entry']).toEqual({
      textures: 'textures/manual',
    });
  });

  it('creates default atlas when input file is missing', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);

    const base = await loadItemTextureBase();

    expect(base).toEqual({
      resource_pack_name: 'arfex_test',
      texture_name: 'atlas.items',
      texture_data: {},
    });
  });

  it('merges registered textures and replaces existing keys', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'RP', 'textures'), { recursive: true });
    await mkdir(join(root, 'out', 'RP', 'textures'), { recursive: true });

    await writeFile(
      join(root, 'RP', 'textures', 'item_texture.json'),
      JSON.stringify({
        resource_pack_name: 'arfex_test',
        texture_name: 'atlas.items',
        texture_data: {
          'artifex:test': { textures: 'textures/old/path' },
          'manual:entry': { textures: 'textures/manual' },
        },
      }),
      'utf-8',
    );

    registerItemTexture('artifex:test', 'textures/arfex/test/items/test');

    const outputPath = await flushItemTextures();
    expect(outputPath).toBe(join(root, 'out', 'RP', 'textures', 'item_texture.json'));

    const written = JSON.parse(
      await readFile(outputPath!, 'utf-8'),
    ) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({
      'artifex:test': { textures: 'textures/arfex/test/items/test' },
      'manual:entry': { textures: 'textures/manual' },
    });
  });

  it('prefers existing output atlas during incremental flush', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'out', 'RP', 'textures'), { recursive: true });

    await writeFile(
      join(root, 'out', 'RP', 'textures', 'item_texture.json'),
      JSON.stringify({
        resource_pack_name: 'arfex_test',
        texture_name: 'atlas.items',
        texture_data: {
          'artifex:existing': { textures: 'textures/existing' },
        },
      }),
      'utf-8',
    );

    registerItemTexture('artifex:test', 'textures/arfex/test/items/test');

    await flushItemTextures({ preferOutput: true });

    const written = JSON.parse(
      await readFile(join(root, 'out', 'RP', 'textures', 'item_texture.json'), 'utf-8'),
    ) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({
      'artifex:existing': { textures: 'textures/existing' },
      'artifex:test': { textures: 'textures/arfex/test/items/test' },
    });
  });
});
