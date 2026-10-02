import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import {
  brewingContainerRecipe,
  brewingMixRecipe,
  createRecipe,
  furnaceRecipe,
  shapedRecipe,
  shapelessRecipe,
  smithingTransformRecipe,
  smithingTrimRecipe,
} from '@ferolyte/pack/content/recipe/create-recipe';
import type { RecipeBuilder } from '@ferolyte/pack/content/recipe/recipe-builder';

const build = (builder: RecipeBuilder) => {
  const collector = collectDiagnostics({ silent: true });
  const json = builder
    .withBuildContext({ diagnostics: true, sourceFile: 'a.recipe.ts' })
    .build() as any;
  collector.stop();

  return {
    json,
    errors: collector.records
      .filter((r) => r.severity === 'error')
      .map((r) => `${r.fieldPath}: ${r.message}`),
  };
};

describe('recipe helpers', () => {
  it('builds a shaped recipe with item shorthands and default tags', () => {
    const { json, errors } = build(
      shapedRecipe({
        identifier: 'test:block',
        pattern: ['##', '#S'],
        key: { '#': 'minecraft:stone', S: { tag: 'minecraft:planks' } },
        result: { item: 'test:block', count: 4 },
        unlock: 'minecraft:stone',
      }),
    );

    expect(errors).toEqual([]);
    expect(json).toEqual({
      format_version: '1.20.10',
      'minecraft:recipe_shaped': {
        description: { identifier: 'test:block' },
        tags: ['crafting_table'],
        pattern: ['##', '#S'],
        key: { '#': 'minecraft:stone', S: { tag: 'minecraft:planks' } },
        result: { item: 'test:block', count: 4 },
        unlock: [{ item: 'minecraft:stone' }],
      },
    });
  });

  it('turns a trailing number into the data value', () => {
    const { json } = build(
      shapelessRecipe({
        identifier: 'test:dye',
        ingredients: ['minecraft:dye:2', 'minecraft:stick'],
        result: 'test:green:5',
        unlock: 'AlwaysUnlocked',
      }),
    );

    expect(json['minecraft:recipe_shapeless']).toMatchObject({
      ingredients: [{ item: 'minecraft:dye', data: 2 }, 'minecraft:stick'],
      result: { item: 'test:green', data: 5 },
      unlock: { context: 'AlwaysUnlocked' },
    });
  });

  it('builds the other recipe kinds', () => {
    const furnace = build(
      furnaceRecipe({
        identifier: 'test:smelt',
        input: 'test:ore',
        output: 'test:ingot',
        tags: ['furnace', 'blast_furnace'],
        priority: 1,
      }),
    );
    expect(furnace.errors).toEqual([]);
    expect(furnace.json['minecraft:recipe_furnace']).toMatchObject({
      tags: ['furnace', 'blast_furnace'],
      input: 'test:ore',
      priority: 1,
    });

    const mix = build(
      brewingMixRecipe({
        identifier: 'test:brew',
        input: 'minecraft:potion_type:awkward',
        reagent: 'test:dust',
        output: 'minecraft:potion_type:long_swiftness',
      }),
    );
    expect(mix.errors).toEqual([]);
    expect(mix.json['minecraft:recipe_brewing_mix'].tags).toEqual(['brewing_stand']);

    const container = build(
      brewingContainerRecipe({
        identifier: 'test:container',
        input: 'minecraft:potion',
        reagent: 'minecraft:gunpowder',
        output: 'minecraft:splash_potion',
      }),
    );
    expect(container.errors).toEqual([]);

    const transform = build(
      smithingTransformRecipe({
        identifier: 'test:upgrade',
        template: 'test:template',
        base: 'minecraft:diamond_sword',
        addition: 'minecraft:netherite_ingot',
        result: 'test:sword',
      }),
    );
    expect(transform.errors).toEqual([]);
    expect(transform.json['minecraft:recipe_smithing_transform'].tags).toEqual([
      'smithing_table',
    ]);

    const trim = build(
      smithingTrimRecipe({
        identifier: 'test:trim',
        template: { tag: 'minecraft:trim_templates' },
        base: { tag: 'minecraft:trimmable_armors' },
        addition: { tag: 'minecraft:trim_materials' },
      }),
    );
    expect(trim.errors).toEqual([]);
  });

  it('dispatches createRecipe by type', () => {
    const { json, errors } = build(
      createRecipe({
        type: 'furnace',
        identifier: 'test:smelt',
        input: 'test:ore',
        output: 'test:ingot',
      }),
    );

    expect(errors).toEqual([]);
    expect(json['minecraft:recipe_furnace']).toBeDefined();
  });

  it('honors the version and keeps the identifier for the output file', () => {
    const builder = furnaceRecipe({
      identifier: 'test:smelt',
      input: 'a:b',
      output: 'a:c',
      version: '1.21.50',
    });

    expect(builder.identifier()).toBe('test:smelt');
    expect(build(builder).json.format_version).toBe('1.21.50');
  });
});

describe('recipe checks', () => {
  const shaped = (config: Partial<Parameters<typeof shapedRecipe>[0]>) =>
    build(
      shapedRecipe({
        identifier: 'test:r',
        pattern: ['#'],
        key: { '#': 'minecraft:stone' },
        result: 'test:out',
        ...config,
      }),
    ).errors;

  it('reports an unknown pattern symbol', () => {
    expect(shaped({ pattern: ['#X'] })).toEqual([
      'pattern[0]: Pattern symbol "X" is not defined in key',
    ]);
  });

  it('reports an unused key', () => {
    expect(shaped({ key: { '#': 'a:b', Z: 'a:c' } })).toEqual([
      'key.Z: Key "Z" is not used in the pattern',
    ]);
  });

  it('limits the pattern to 3x3 and single-character keys', () => {
    expect(shaped({ pattern: ['#', '#', '#', '#'] })[0]).toContain('1 to 3 rows');
    expect(shaped({ pattern: ['####'] })[0]).toContain('1 to 3 symbols');
    expect(shaped({ key: { '#': 'a:b', ab: 'a:c' } }).join()).toContain(
      'single character',
    );
  });

  it('treats a space as an empty slot', () => {
    expect(shaped({ pattern: ['# #'], key: { '#': 'a:b' } })).toEqual([]);
  });

  it('reports an empty result and bad identifiers', () => {
    expect(shaped({ result: [] })).toEqual(['result: Recipe result is empty']);
    expect(shaped({ result: '' })).toEqual(['result: Recipe result is empty']);
    expect(shaped({ result: { tag: 'a:b' } })[0]).toContain('not a tag');
    expect(shaped({ identifier: 'Bad' })[0]).toContain('namespace:name');
  });

  it('checks shapeless ingredient count', () => {
    const errors = build(
      shapelessRecipe({ identifier: 'test:s', ingredients: [], result: 'a:b' }),
    ).errors;
    expect(errors[0]).toContain('at least one ingredient');
  });
});
