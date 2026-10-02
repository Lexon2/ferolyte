import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'jsonc-parser';
import { describe, expect, it } from 'vitest';

import type { ProjectDocument, RegistryIndex } from '../project-registry';
import { checkRecipeDocument } from './recipe';
import { checkSpawnRuleDocument } from './spawn-rule';

const index = (
  items: string[],
  blocks: string[] = [],
  entities: Record<string, unknown> = {},
): RegistryIndex =>
  ({
    items: new Set(items),
    blocks: new Map(blocks.map((id) => [id, { states: new Set<string>() }])),
    entities: new Map(
      Object.entries(entities).map(([id, json]) => [
        id,
        { id, source: 'x', events: new Set(), componentGroups: new Set(), properties: new Set(), json },
      ]),
    ),
  }) as unknown as RegistryIndex;

const doc = (kind: ProjectDocument['kind'], json: unknown): ProjectDocument => ({
  source: 'a.ts',
  kind,
  json,
});

const run = (
  check: typeof checkRecipeDocument,
  document: ProjectDocument,
  registry: RegistryIndex,
) => {
  const reports: string[] = [];
  check(document, registry, {
    namespaces: new Set(['ns']),
    report: (path, message) => reports.push(`${path}: ${message}`),
  });

  return reports;
};

describe('checkRecipeDocument', () => {
  const registry = index(['ns:ingot', 'ns:ore'], ['ns:block']);

  it('accepts project items, blocks and vanilla ids', () => {
    const reports = run(
      checkRecipeDocument,
      doc('recipe', {
        format_version: '1.20.10',
        'minecraft:recipe_shaped': {
          description: { identifier: 'ns:r' },
          pattern: ['##'],
          key: { '#': 'ns:ingot' },
          result: { item: 'ns:block', count: 1 },
          unlock: [{ item: 'minecraft:stone' }],
        },
      }),
      registry,
    );

    expect(reports).toEqual([]);
  });

  it('reports unknown project-owned items with a hint, never vanilla ones', () => {
    const reports = run(
      checkRecipeDocument,
      doc('recipe', {
        format_version: '1.20.10',
        'minecraft:recipe_furnace': {
          description: { identifier: 'ns:smelt' },
          input: 'ns:ore',
          output: { item: 'ns:ingott' },
        },
        'minecraft:recipe_shapeless': {
          description: { identifier: 'ns:s' },
          ingredients: ['minecraft:not_a_real_item', 'ns:oar'],
          result: 'ns:ingot:2',
        },
      }),
      registry,
    );

    expect(reports).toEqual([
      'minecraft:recipe_furnace.output: unknown item or block "ns:ingott" (did you mean "ns:ingot"?)',
      'minecraft:recipe_shapeless.ingredients[1]: unknown item or block "ns:oar" (did you mean "ns:ore"?)',
    ]);
  });

  it('checks unlock items and tag format', () => {
    const reports = run(
      checkRecipeDocument,
      doc('recipe', {
        'minecraft:recipe_smithing_trim': {
          description: { identifier: 'ns:t' },
          template: { tag: 'planks' },
          base: { tag: 'minecraft:planks' },
          addition: 'ns:ore',
          unlock: [{ item: 'ns:missing' }, { context: 'AlwaysUnlocked' }],
        },
      }),
      registry,
    );

    expect(reports).toEqual([
      'minecraft:recipe_smithing_trim.template: item tag "planks" must be written as "namespace:name"',
      'minecraft:recipe_smithing_trim.unlock[0]: unknown item or block "ns:missing"',
    ]);
  });

  it('ignores brewing potion ids', () => {
    expect(
      run(
        checkRecipeDocument,
        doc('recipe', {
          'minecraft:recipe_brewing_mix': {
            description: { identifier: 'ns:b' },
            input: 'ns:potion_type:x',
            reagent: 'ns:y',
            output: 'ns:z',
          },
        }),
        registry,
      ),
    ).toEqual([]);
  });

  const recipes = join(__dirname, '../../../../../.cache/bedrock-samples/behavior_pack/recipes');
  it.skipIf(!existsSync(recipes))('is silent on the vanilla recipe corpus', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? walk(join(dir, entry.name))
          : entry.name.endsWith('.json')
            ? [join(dir, entry.name)]
            : [],
      );
    const files = walk(recipes);
    const all: string[] = [];
    for (const file of files) {
      all.push(
        ...run(
          checkRecipeDocument,
          doc('recipe', parse(readFileSync(file, 'utf8'))),
          registry,
        ).map((report) => `${file}: ${report}`),
      );
    }

    expect(files.length).toBeGreaterThan(1000);
    expect(all).toEqual([]);
  });
});

describe('checkSpawnRuleDocument', () => {
  const rule = (id: string) =>
    doc('spawn-rule', {
      format_version: '1.8.0',
      'minecraft:spawn_rules': { description: { identifier: id, population_control: 'animal' } },
    });

  it('accepts known project entities and vanilla ones', () => {
    const registry = index([], [], { 'ns:mob': { 'minecraft:entity': { description: {} } } });

    expect(run(checkSpawnRuleDocument, rule('ns:mob'), registry)).toEqual([]);
    expect(run(checkSpawnRuleDocument, rule('minecraft:cow'), registry)).toEqual([]);
  });

  it('reports an unknown project entity with a hint', () => {
    const registry = index([], [], { 'ns:mob': {} });

    expect(run(checkSpawnRuleDocument, rule('ns:mub'), registry)).toEqual([
      'minecraft:spawn_rules.description.identifier: unknown entity "ns:mub" (did you mean "ns:mob"?)',
    ]);
  });

  it('warns about an entity that is not spawnable', () => {
    const registry = index([], [], {
      'ns:mob': { 'minecraft:entity': { description: { is_spawnable: false } } },
    });

    expect(run(checkSpawnRuleDocument, rule('ns:mob'), registry)[0]).toContain(
      'is_spawnable: false',
    );
  });
});
