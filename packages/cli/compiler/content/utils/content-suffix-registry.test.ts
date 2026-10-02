import { join } from 'path';

import { describe, expect, it, beforeEach } from 'vitest';

import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { BUILD_CONTEXT } from '../../build-context';
import { buildContentSuffixRegistry } from './content-suffix-registry';

const setupBuildContext = () => {
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = '/out/BP';
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = '/out/RP';
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'myaddon';
};

describe('buildContentSuffixRegistry', () => {
  beforeEach(() => {
    setupBuildContext();
  });

  it('matches default legacy suffixes', () => {
    const registry = buildContentSuffixRegistry();

    expect(
      registry.resolveContentFile('/packs/BP/blocks/stone.block.ts'),
    ).toEqual({
      contentType: 'block',
      metadata: CONTENT_METADATA.BLOCK,
      inputSuffix: 'block',
    });
    expect(
      registry.resolveContentFile('/packs/BP/items/apple.item.ts'),
    ).toEqual({
      contentType: 'item',
      metadata: CONTENT_METADATA.ITEM,
      inputSuffix: 'item',
    });
    expect(registry.resolveContentFile('/packs/BP/entities/cow.se.ts')).toEqual(
      {
        contentType: 'server-entity',
        metadata: CONTENT_METADATA.SERVER_ENTITY,
        inputSuffix: 'se',
      },
    );
    expect(registry.resolveContentFile('/packs/RP/entity/cow.ce.ts')).toEqual({
      contentType: 'client-entity',
      metadata: CONTENT_METADATA.CLIENT_ENTITY,
      inputSuffix: 'ce',
    });
  });

  it('resolves custom multi-suffix types', () => {
    const registry = buildContentSuffixRegistry({
      block: ['b', 'bl'],
    });

    expect(
      registry.resolveContentFile('/packs/BP/blocks/stone.b.ts')?.inputSuffix,
    ).toBe('b');
    expect(
      registry.resolveContentFile('/packs/BP/blocks/stone.bl.ts')?.inputSuffix,
    ).toBe('bl');
  });

  it('prefers the longest matching suffix', () => {
    const registry = buildContentSuffixRegistry({
      'server-entity': ['bp', 'e.bp'],
    });

    expect(
      registry.resolveContentFile('/packs/BP/entities/cow.e.bp.ts')
        ?.inputSuffix,
    ).toBe('e.bp');
    expect(
      registry.resolveContentFile('/packs/BP/entities/cow.bp.ts')?.inputSuffix,
    ).toBe('bp');
  });

  it('normalizes suffix values with .ts prefix', () => {
    const registry = buildContentSuffixRegistry({
      block: ['b.ts'],
    });

    expect(registry.isFerolyteContentFile('/packs/BP/blocks/stone.b.ts')).toBe(
      true,
    );
  });

  it('throws when the same suffix is configured for multiple types', () => {
    expect(() =>
      buildContentSuffixRegistry({
        block: ['shared'],
        item: ['shared'],
      }),
    ).toThrow(/Duplicate content suffix "shared"/);
  });

  it('throws for invalid suffix characters', () => {
    expect(() =>
      buildContentSuffixRegistry({
        block: ['Bad-Suffix'],
      }),
    ).toThrow(/Invalid content suffix "Bad-Suffix"/);
  });

  it('mirrors matched input suffix in output JSON names', () => {
    const registry = buildContentSuffixRegistry({
      'server-entity': ['e.bp'],
    });

    const outputPath = registry.createContentOutputPath(
      '/packs/BP/entities/foo.e.bp.ts',
      { identifier: 'ns:bar' },
    );

    expect(outputPath).toBe(
      join('/out/BP', 'entities', 'myaddon', 'bar.e.bp.json'),
    );
  });

  it('routes output directories by content type pack', () => {
    const registry = buildContentSuffixRegistry({
      block: ['b'],
      'client-entity': ['entity'],
    });

    expect(
      registry.createContentOutputPath('/packs/BP/blocks/stone.b.ts', {
        identifier: 'ns:stone',
      }),
    ).toBe(join('/out/BP', 'blocks', 'myaddon', 'stone.b.json'));

    expect(
      registry.createContentOutputPath('/packs/RP/entity/cow.entity.ts', {
        identifier: 'ns:cow',
      }),
    ).toBe(join('/out/RP', 'entity', 'myaddon', 'cow.entity.json'));
  });

  it('uses source basename for delete paths without identifier', () => {
    const registry = buildContentSuffixRegistry({
      'server-entity': ['e.bp'],
    });

    expect(
      registry.createContentOutputPath('/packs/BP/entities/foo.e.bp.ts'),
    ).toBe(join('/out/BP', 'entities', 'myaddon', 'foo.e.bp.json'));
  });

  it('registers attachables, render controllers, recipes and spawn rules', () => {
    const registry = buildContentSuffixRegistry();
    const cases = [
      ['/packs/RP/attachables/wand.att.ts', 'attachable', CONTENT_METADATA.ATTACHABLE, join('/out/RP', 'attachables', 'myaddon', 'wand.att.json')],
      ['/packs/RP/render_controllers/mob.rc.ts', 'render-controller', CONTENT_METADATA.RENDER_CONTROLLER, join('/out/RP', 'render_controllers', 'myaddon', 'mob.rc.json')],
      ['/packs/BP/recipes/plank.recipe.ts', 'recipe', CONTENT_METADATA.RECIPE, join('/out/BP', 'recipes', 'myaddon', 'plank.recipe.json')],
      ['/packs/BP/spawn_rules/mob.spawn.ts', 'spawn-rule', CONTENT_METADATA.SPAWN_RULE, join('/out/BP', 'spawn_rules', 'myaddon', 'mob.spawn.json')],
    ] as const;

    for (const [file, contentType, metadata, output] of cases) {
      expect(registry.resolveContentFile(file)).toMatchObject({
        contentType,
        metadata,
      });
      expect(registry.createContentOutputPath(file)).toBe(output);
    }
  });

  it('keeps the new suffixes configurable', () => {
    const registry = buildContentSuffixRegistry({
      recipe: ['rcp'],
      'spawn-rule': ['sr'],
    });

    expect(
      registry.resolveContentFile('/packs/BP/recipes/a.rcp.ts')?.contentType,
    ).toBe('recipe');
    expect(
      registry.resolveContentFile('/packs/BP/recipes/a.recipe.ts'),
    ).toBeUndefined();
    expect(
      registry.resolveContentFile('/packs/BP/spawn_rules/a.sr.ts')?.contentType,
    ).toBe('spawn-rule');
  });
});
