import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { collectDiagnostics } from '../check/diagnostics-collector';
import {
  beginSourceDocuments,
  clearRegistry,
  commitSourceDocuments,
  registerContentJson,
} from './project-registry';
import { refreshRegistry } from './refresh';

let root: string;
let previousCwd: string;

const write = async (path: string, content: unknown) => {
  const file = join(root, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, typeof content === 'string' ? content : JSON.stringify(content));
};

const register = (source: string, kind: any, json: unknown) => {
  beginSourceDocuments(source);
  registerContentJson(source, kind, json);
  commitSourceDocuments(source);
};

const check = async () => {
  const collector = collectDiagnostics({ silent: true });
  await refreshRegistry({ ids: false });
  collector.stop();

  return collector.records.map((r) => `${r.fieldPath}: ${r.message}`);
};

const block = (components: Record<string, unknown>) => ({
  format_version: '1.26.50',
  'minecraft:block': { description: { identifier: 'ns:b' }, components },
});

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-live-checks-'));
  previousCwd = process.cwd();
  process.chdir(root);
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.NAMESPACE = 'ns';
  clearRegistry();
});

afterEach(async () => {
  process.chdir(previousCwd);
  clearRegistry();
  await rm(root, { recursive: true, force: true });
});

describe('21: vanilla texture keys', () => {
  it('are not reported, project typos still are', async () => {
    await write('RP/textures/terrain_texture.json', { texture_data: { my_ore: { textures: 'textures/blocks/my_ore' } } });
    await write('RP/textures/item_texture.json', { texture_data: { my_gem: { textures: 'textures/items/my_gem' } } });
    register('/src/b.block.ts', 'block', block({
      'minecraft:material_instances': {
        '*': { texture: 'stone' },
        side: { texture: 'planks' },
        top: { texture: 'stonebrick' },
        bottom: { texture: 'my_ore' },
        typo: { texture: 'my_oer' },
      },
    }));
    register('/src/i.item.ts', 'item', {
      format_version: '1.21.70',
      'minecraft:item': { description: { identifier: 'ns:i' }, components: { 'minecraft:icon': 'apple' } },
    });
    register('/src/j.item.ts', 'item', {
      format_version: '1.21.70',
      'minecraft:item': { description: { identifier: 'ns:j' }, components: { 'minecraft:icon': 'my_gme' } },
    });

    const messages = await check();

    expect(messages).toEqual([
      'components.minecraft:material_instances.typo: unknown terrain texture key "my_oer" (did you mean "my_ore"?)',
      'components.minecraft:icon: unknown item texture key "my_gme" (did you mean "my_gem"?)',
    ]);
  });
});

describe('18: loot tables, culling rules and voxel shapes', () => {
  beforeEach(async () => {
    await write('BP/loot_tables/blocks/ore.json', { pools: [] });
    await write('RP/block_culling/rules.json', {
      format_version: '1.21.80',
      'minecraft:block_culling_rules': { description: { identifier: 'ns:my_rule' }, rules: [] },
    });
    await write('BP/shapes/slab.json', {
      format_version: '1.21.80',
      'minecraft:voxel_shape': { description: { identifier: 'ns:slab' }, shape: { boxes: [] } },
    });
  });

  it('accepts what the pack declares and built-in minecraft: ids', async () => {
    register('/src/ok.block.ts', 'block', block({
      'minecraft:loot': 'loot_tables/blocks/ore.json',
      'minecraft:geometry': {
        identifier: 'geometry.b',
        culling: 'ns:my_rule',
        culling_shape: 'ns:slab',
      },
    }));
    register('/src/ok2.block.ts', 'block', block({
      'minecraft:geometry': { identifier: 'geometry.c', culling: 'ns:slab', culling_shape: 'minecraft:unit_cube' },
    }));

    expect(await check()).toEqual([]);
  });

  it('is silent for vanilla loot tables (block and entity), typos still warn', async () => {
    register('/src/v.block.ts', 'block', block({ 'minecraft:loot': 'loot_tables/empty.json' }));
    register('/src/w.block.ts', 'block', block({ 'minecraft:loot': 'loot_tables/empty.jsn' }));
    register('/src/e.se.ts', 'server-entity', {
      format_version: '1.21.70',
      'minecraft:entity': {
        description: { identifier: 'ns:e' },
        components: { 'minecraft:loot': { table: 'loot_tables/empty.json' } },
      },
    });

    expect(await check()).toEqual([
      'components.minecraft:loot: unknown loot table "loot_tables/empty.jsn"',
    ]);
  });

  it('warns for ids no file declares, with a hint', async () => {
    register('/src/bad.block.ts', 'block', block({
      'minecraft:loot': 'loot_tables/blocks/ore_typo.json',
      'minecraft:geometry': { identifier: 'geometry.b', culling: 'ns:my_rul', culling_shape: 'ns:slabb' },
    }));

    expect(await check()).toEqual([
      'components.minecraft:loot: unknown loot table "loot_tables/blocks/ore_typo.json" (did you mean "loot_tables/blocks/ore.json"?)',
      'components.minecraft:geometry.culling: unknown culling rule "ns:my_rul" (did you mean "ns:my_rule"?)',
      'components.minecraft:geometry.culling_shape: unknown voxel shape "ns:slabb" (did you mean "ns:slab"?)',
    ]);
  });
});
