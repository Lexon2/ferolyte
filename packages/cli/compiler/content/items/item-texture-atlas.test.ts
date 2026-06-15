import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../../build-context';
import {
  clearAllSourceItemTextures,
  flushItemTextures,
  loadItemTextureBase,
  removeSourceItemTextures,
  setSourceItemTextures,
} from './item-texture-atlas';

const tempRoots: string[] = [];

const createTempRoot = async (): Promise<string> => {
  const root = join(
    tmpdir(),
    `ferolyte-item-texture-${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
    clearAllSourceItemTextures();
  });

  afterEach(async () => {
    await Promise.all(
      tempRoots
        .splice(0)
        .map((root) => rm(root, { recursive: true, force: true })),
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
          'ferolyte:test': { textures: 'textures/old/path' },
          'manual:entry': { textures: 'textures/manual' },
        },
      }),
      'utf-8',
    );

    setSourceItemTextures(join(root, 'items', 'test.item.ts'), [
      { key: 'ferolyte:test', textures: 'textures/arfex/test/items/test' },
    ]);

    const outputPath = await flushItemTextures();
    expect(outputPath).toBe(
      join(root, 'out', 'RP', 'textures', 'item_texture.json'),
    );

    const written = JSON.parse(await readFile(outputPath!, 'utf-8')) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({
      'ferolyte:test': { textures: 'textures/arfex/test/items/test' },
      'manual:entry': { textures: 'textures/manual' },
    });
  });

  it('removes stale texture keys when a source is updated', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'RP', 'textures'), { recursive: true });
    await mkdir(join(root, 'out', 'RP', 'textures'), { recursive: true });

    const sourcePath = join(root, 'items', 'apples.item.ts');

    setSourceItemTextures(sourcePath, [
      { key: 'ferolyte:apple_a', textures: 'textures/a' },
      { key: 'ferolyte:apple_b', textures: 'textures/b' },
    ]);
    await flushItemTextures();

    setSourceItemTextures(sourcePath, [
      { key: 'ferolyte:apple_a', textures: 'textures/a' },
    ]);
    await flushItemTextures();

    const written = JSON.parse(
      await readFile(
        join(root, 'out', 'RP', 'textures', 'item_texture.json'),
        'utf-8',
      ),
    ) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({
      'ferolyte:apple_a': { textures: 'textures/a' },
    });
  });

  it('keeps textures from other sources during incremental flush', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'out', 'RP', 'textures'), { recursive: true });

    setSourceItemTextures(join(root, 'items', 'existing.item.ts'), [
      { key: 'ferolyte:existing', textures: 'textures/existing' },
    ]);
    setSourceItemTextures(join(root, 'items', 'test.item.ts'), [
      { key: 'ferolyte:test', textures: 'textures/arfex/test/items/test' },
    ]);

    await flushItemTextures();

    const written = JSON.parse(
      await readFile(
        join(root, 'out', 'RP', 'textures', 'item_texture.json'),
        'utf-8',
      ),
    ) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({
      'ferolyte:existing': { textures: 'textures/existing' },
      'ferolyte:test': { textures: 'textures/arfex/test/items/test' },
    });
  });

  it('removes source textures on removeSourceItemTextures', async () => {
    const root = await createTempRoot();
    setupBuildContext(root);
    await mkdir(join(root, 'out', 'RP', 'textures'), { recursive: true });

    const sourcePath = join(root, 'items', 'test.item.ts');

    setSourceItemTextures(sourcePath, [
      { key: 'ferolyte:test', textures: 'textures/test' },
    ]);
    await flushItemTextures();

    removeSourceItemTextures(sourcePath);
    await flushItemTextures({ force: true });

    const written = JSON.parse(
      await readFile(
        join(root, 'out', 'RP', 'textures', 'item_texture.json'),
        'utf-8',
      ),
    ) as {
      texture_data: Record<string, { textures: string }>;
    };

    expect(written.texture_data).toEqual({});
  });
});
