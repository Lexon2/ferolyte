import { describe, expect, it } from 'vitest';

import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

describe('ServerEntityBuilder', () => {
  it('builds minimal entity structure', () => {
    const entity = new ServerEntityBuilder(minimalServerEntityConfig()).build();

    expect(entity).toEqual({
      format_version: '1.21.70',
      'minecraft:entity': {
        description: {
          identifier: 'test:entity',
          is_spawnable: true,
          is_summonable: true,
          is_experimental: false,
        },
        components: undefined,
      },
    });
  });

  it('uses custom version', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({ version: '1.26.0' }),
    ).build();

    expect(entity.format_version).toBe('1.26.0');
  });

  it('maps description flags', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        isExperimental: true,
        isSpawnable: false,
        isSummonable: false,
        spawnCategory: 'creature',
        runtimeIdentifier: 'minecraft:pig',
      }),
    ).build();

    expect(entity['minecraft:entity'].description).toEqual({
      identifier: 'test:entity',
      is_spawnable: false,
      is_summonable: false,
      is_experimental: true,
      spawn_category: 'creature',
      runtime_identifier: 'minecraft:pig',
    });
  });

  it('converts registered components through factory', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          health: { value: 20 },
          shareables: { allItems: true },
        },
      }),
    ).build();

    expect(entity['minecraft:entity'].components).toEqual({
      'minecraft:health': { value: 20 },
      'minecraft:shareables': { all_items: true },
    });
  });

  it('converts behaviors nested under components.behaviors', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          behaviors: {
            float: { priority: 0, sinkWithPassengers: true },
          },
        },
      }),
    ).build();

    expect(entity['minecraft:entity'].components).toEqual({
      'minecraft:behavior.float': {
        priority: 0,
        sink_with_passengers: true,
      },
    });
  });

  it('converts component groups', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        componentGroups: [
          {
            name: 'adult',
            components: { health: { value: 40 } },
          },
        ],
      }),
    ).build();

    expect(entity['minecraft:entity'].component_groups).toEqual({
      adult: {
        'minecraft:health': { value: 40 },
      },
    });
  });

  it('converts events with snake_case actions', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        events: {
          test: {
            queueCommand: { command: '/say hello', target: 'self' },
            firstValid: [{ trigger: 'fallback_event' }],
            add: { componentGroups: ['adult'] },
          },
        },
      }),
    ).build();

    expect(entity['minecraft:entity'].events).toEqual({
      test: {
        queue_command: { command: '/say hello', target: 'self' },
        first_valid: [{ trigger: 'fallback_event' }],
        add: { component_groups: ['adult'] },
      },
    });
  });

  it('skips invalid components', () => {
    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          health: { value: -1 },
          shareables: { allItems: true },
        },
      }),
    ).build();

    expect(entity['minecraft:entity'].components).toEqual({
      'minecraft:shareables': { all_items: true },
    });
  });

  it('clones config independently', () => {
    const builder = new ServerEntityBuilder(
      minimalServerEntityConfig({ components: { health: { value: 10 } } }),
    );
    const clone = builder.cloneConfig();
    clone.components = { health: { value: 99 } };

    expect(builder.cloneConfig().components?.health).toEqual({ value: 10 });
  });
});
