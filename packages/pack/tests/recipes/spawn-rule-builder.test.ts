import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { createSpawnRule } from '@ferolyte/pack/content/spawn-rule/create-spawn-rule';
import type { SpawnRuleConfig } from '@ferolyte/pack/content/spawn-rule/spawn-rule-types';

const build = (config: Partial<SpawnRuleConfig>) => {
  const collector = collectDiagnostics({ silent: true });
  const json = createSpawnRule({
    identifier: 'test:mob',
    populationControl: 'animal',
    conditions: [{ weight: { default: 10 } }],
    ...config,
  })
    .withBuildContext({ diagnostics: true, sourceFile: 'a.spawn.ts' })
    .build() as any;
  collector.stop();

  return {
    json,
    errors: collector.records
      .filter((r) => r.severity === 'error')
      .map((r) => `${r.fieldPath}: ${r.message}`),
  };
};

describe('createSpawnRule', () => {
  it('builds generated conditions with shared filters', () => {
    const { json, errors } = build({
      conditions: [
        {
          spawnsOnSurface: {},
          brightnessFilter: { min: 7, max: 15, adjustForWeather: false },
          weight: { default: 10 },
          densityLimit: { surface: 4 },
          herd: { minSize: 2, maxSize: 4, event: 'ns:born' },
          biomeFilter: {
            anyOf: [
              { test: 'has_biome_tag', operator: '==', value: 'plains' },
              { test: 'has_biome_tag', operator: '==', value: 'forest' },
            ],
          },
        },
      ],
    });

    expect(errors).toEqual([]);
    expect(json).toEqual({
      format_version: '1.8.0',
      'minecraft:spawn_rules': {
        description: { identifier: 'test:mob', population_control: 'animal' },
        conditions: [
          {
            'minecraft:spawns_on_surface': {},
            'minecraft:brightness_filter': { min: 7, max: 15, adjust_for_weather: false },
            'minecraft:weight': { default: 10 },
            'minecraft:density_limit': { surface: 4 },
            'minecraft:herd': { min_size: 2, max_size: 4, event: 'ns:born' },
            'minecraft:biome_filter': {
              any_of: [
                { test: 'has_biome_tag', operator: '==', value: 'plains' },
                { test: 'has_biome_tag', operator: '==', value: 'forest' },
              ],
            },
          },
        ],
      },
    });
  });

  it('reports unknown conditions with a hint and a bad population control', () => {
    const { errors } = build({
      populationControl: 'nope' as never,
      conditions: [{ weigth: { default: 1 } } as never],
    });

    expect(errors.join('\n')).toContain('Did you mean "weight"');
    expect(errors.join('\n')).toContain('Must be one of');
  });

  it('checks identifier, empty conditions and inverted ranges', () => {
    expect(build({ identifier: 'Mob' }).errors[0]).toContain('namespace:name');
    expect(build({ conditions: [] }).errors[0]).toContain('at least one condition');
    const ranges = build({
      conditions: [
        { herd: { minSize: 5, maxSize: 2 }, heightFilter: { min: 10, max: 0 } },
      ],
    }).errors;
    expect(ranges).toEqual([
      'conditions[0].herd: minSize (5) is greater than maxSize (2)',
      'conditions[0].heightFilter: min (10) is greater than max (0)',
    ]);
  });

  it('keeps the entity identifier for the output file name', () => {
    expect(
      createSpawnRule({
        identifier: 'test:mob',
        populationControl: 'monster',
        conditions: [{}],
      }).identifier(),
    ).toBe('test:mob');
  });
});
