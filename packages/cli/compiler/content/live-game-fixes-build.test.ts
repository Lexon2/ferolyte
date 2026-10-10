import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createBlock } from '@ferolyte/pack/content/block/create-block';
import { createItem } from '@ferolyte/pack/content/item/create-item';
import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { BUILD_CONTEXT } from '../build-context';
import { collectDiagnostics } from '../check/diagnostics-collector';
import { getSourceLang } from '../lang/lang-registry';
import { buildContentJson } from './content.factory';
import { buildContentSuffixRegistry } from './utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-live-'));
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
  BUILD_CONTEXT.PACKS.MIN_GAME_VERSION = '1.26.20';
});

afterEach(() => rm(root, { recursive: true, force: true }));

/** Builds through the compiler and returns the written JSON with the diagnostics. */
const build = async (file: string, builder: unknown) => {
  const collector = collectDiagnostics({ silent: true });
  const source = join(root, 'src', file);
  const result = await buildContentJson(
    source,
    { default: builder },
    { debug: true, diagnostics: true },
  );
  collector.stop();
  if (result instanceof Error || result === undefined) {
    throw result ?? new Error('build returned nothing');
  }

  return {
    json: JSON.parse(await readFile(result.outFile[0], 'utf-8')),
    source,
    errors: collector.records.filter((r) => r.severity === 'error'),
    warnings: collector.records.filter((r) => r.severity === 'warning'),
  };
};

const components = (json: any) => json['minecraft:block'].components;

describe('16: blockPlacer.useOn names blocks', () => {
  it('writes block names and descriptors as given', async () => {
    const { json, errors } = await build(
      'seed.item.ts',
      createItem({
        identifier: 'ns:seed',
        components: {
          blockPlacer: {
            block: 'ns:crop',
            useOn: [
              'minecraft:farmland',
              { name: 'minecraft:dirt', states: { dirt_type: 'coarse' } },
              { tags: "q.any_tag('dirt')" },
            ],
          },
        },
      }),
    );

    expect(errors).toEqual([]);
    expect(json['minecraft:item'].components['minecraft:block_placer'].use_on).toEqual([
      'minecraft:farmland',
      { name: 'minecraft:dirt', states: { dirt_type: 'coarse' } },
      { tags: "q.any_tag('dirt')" },
    ]);
  });
});

describe('17: boolean boneVisibility', () => {
  it('is written as a string with a warning that names the bone', async () => {
    const { json, errors, warnings } = await build(
      'a.block.ts',
      createBlock({
        identifier: 'ns:a',
        components: {
          geometry: {
            identifier: 'geometry.a',
            boneVisibility: { lid: false, base: true, glow: 'q.is_moving' } as never,
          },
        },
      }),
    );

    expect(errors).toEqual([]);
    expect(components(json)['minecraft:geometry'].bone_visibility).toEqual({
      lid: 'false',
      base: 'true',
      glow: 'q.is_moving',
    });
    expect(warnings.map((w) => `${w.fieldPath}: ${w.message}`)).toEqual([
      expect.stringContaining('boneVisibility.lid'),
      expect.stringContaining('boneVisibility.base'),
    ]);
    expect(warnings[0].message).toContain('"false"');
  });
});

describe('19: components.tags follows the written format version', () => {
  const tagged = (config: Record<string, unknown>) =>
    build(
      'b.block.ts',
      createBlock({ identifier: 'ns:b', components: { tags: ['minecraft:crop', 'wheat'] }, ...config }),
    );

  it('writes minecraft:tags from 1.26.20', async () => {
    const { json, errors } = await tagged({ version: '1.26.50' });

    expect(errors).toEqual([]);
    expect(components(json)).toEqual({ 'minecraft:tags': ['minecraft:crop', 'wheat'] });
    expect((await tagged({ version: '1.26.20' })).json['minecraft:block'].components).toHaveProperty(
      'minecraft:tags',
    );
  });

  it('keeps the tag:<name> keys for older versions', async () => {
    const { json } = await tagged({ version: '1.21.90' });

    expect(components(json)).toEqual({ 'tag:minecraft:crop': {}, 'tag:wheat': {} });
  });

  it('uses the block default version: 1.21.70 with minGameVersion 1.26.20, 1.26.40+ follows the profile', async () => {
    expect(components((await tagged({})).json)).toHaveProperty(['tag:wheat']);

    BUILD_CONTEXT.PACKS.MIN_GAME_VERSION = '1.26.40';
    const { json } = await tagged({});
    expect(json.format_version).toBe('1.26.40');
    expect(components(json)).toHaveProperty(['minecraft:tags']);
  });

  it('lets rawComponents win', async () => {
    const { json } = await tagged({
      version: '1.26.50',
      rawComponents: { 'minecraft:tags': ['raw:only'] },
    });

    expect(components(json)['minecraft:tags']).toEqual(['raw:only']);
  });

  it('applies to permutations too', async () => {
    const { json } = await build(
      'p.block.ts',
      createBlock({
        identifier: 'ns:p',
        version: '1.26.50',
        states: { 'ns:on': [false, true] },
        permutations: [
          { condition: { states: { 'ns:on': [true] } } as never, components: { tags: ['x:y'] } },
        ],
      }),
    );

    expect(json['minecraft:block'].permutations[0].components).toEqual({ 'minecraft:tags': ['x:y'] });
  });
});

describe('20: redstoneProducer.stronglyPoweredFace is one face', () => {
  const producer = (face: unknown) =>
    build(
      'r.block.ts',
      createBlock({
        identifier: 'ns:r',
        components: { redstoneProducer: { power: 15, stronglyPoweredFace: face as never } },
      }),
    );

  it('writes the string', async () => {
    const { json, errors, warnings } = await producer('up');

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(components(json)['minecraft:redstone_producer']).toEqual({
      power: 15,
      strongly_powered_face: 'up',
    });
  });

  it('unwraps a one-element list with a warning, rejects a longer one', async () => {
    const one = await producer(['down']);
    expect(components(one.json)['minecraft:redstone_producer'].strongly_powered_face).toBe('down');
    expect(one.errors).toEqual([]);
    expect(one.warnings[0].message).toContain('one face');

    const many = await producer(['up', 'down']);
    expect(many.errors[0].message).toContain('takes one face');
  });

  it('drops an empty list with a warning', async () => {
    const { json, errors, warnings } = await producer([]);

    expect(errors).toEqual([]);
    expect(warnings[0].message).toContain('empty list');
    expect(components(json)['minecraft:redstone_producer']).toEqual({ power: 15 });
  });

  it('rejects faces the game does not know', async () => {
    expect((await producer('side')).errors[0].message).toContain('Must be one of');
  });
});

describe('23: spawnEggName', () => {
  const langOf = async (config: Record<string, unknown>) => {
    const { source } = await build(
      'e.se.ts',
      createServerEntity({ identifier: 'ns:e', ...config } as never),
    );

    return Object.fromEntries(getSourceLang(source).map((e) => [e.key, e.translations]));
  };

  it('names the egg separately', async () => {
    const lang = await langOf({ displayName: 'Golem', spawnEggName: 'Golem Spawn Egg' });

    expect(lang['entity.ns:e.name']).toEqual({ en_US: 'Golem' });
    expect(lang['item.spawn_egg.entity.ns:e.name']).toEqual({ en_US: 'Golem Spawn Egg' });
  });

  it('keeps naming the egg like the entity when unset', async () => {
    const lang = await langOf({ displayName: { en_US: 'Golem', ru_RU: 'Голем' } });

    expect(lang['item.spawn_egg.entity.ns:e.name']).toEqual({ en_US: 'Golem', ru_RU: 'Голем' });
  });
});

describe('27: multiBlock trait requirements', () => {
  const filter = { conditions: [{ allowedFaces: ['up' as const] }] };
  const multiBlock = (config: Record<string, unknown>) =>
    build(
      'door.block.ts',
      createBlock({
        identifier: 'ns:door',
        version: '1.26.50',
        traits: { multiBlock: { direction: 'up', enabledStates: ['minecraft:multi_block_part'] } },
        components: { movable: { movementType: 'push' }, placementFilter: filter },
        ...config,
      }),
    );

  it('accepts format 1.26.50 with movable and placementFilter in the base components', async () => {
    const { json, errors, warnings } = await multiBlock({});

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(json['minecraft:block'].description.traits).toHaveProperty(['minecraft:multi_block']);
  });

  it('warns below format 1.26.40 and names the toggle', async () => {
    const { errors, warnings } = await multiBlock({ version: '1.26.30' });

    expect(errors).toEqual([]);
    expect(warnings.map((w) => w.message)).toEqual([
      expect.stringContaining("'Upcoming Creator Features' toggle"),
    ]);
  });

  it('errors without minecraft:movable, and accepts it from rawComponents', async () => {
    const { errors } = await multiBlock({ components: { placementFilter: filter } });

    expect(errors.map((e) => e.message)).toEqual([expect.stringContaining('`movable`')]);
    const raw = await multiBlock({
      components: {},
      rawComponents: { 'minecraft:movable': { movement_type: 'push' } },
    });
    expect(raw.errors).toEqual([]);
  });

  it('errors for placementFilter in a permutation', async () => {
    const { errors } = await multiBlock({
      permutations: [
        {
          condition: { states: { 'minecraft:multi_block_part': [0] } } as never,
          components: { placementFilter: filter },
        },
      ],
    });

    expect(errors.map((e) => [e.fieldPath, e.message])).toEqual([
      ['permutations[0].components.placementFilter', expect.stringContaining('not valid in multi block permutations')],
    ]);
  });
});
