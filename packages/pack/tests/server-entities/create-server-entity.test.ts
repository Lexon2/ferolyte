import { describe, expect, it } from 'vitest';

import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

describe('createServerEntity', () => {
  it('merges multiple ServerEntityConfig objects', () => {
    const builder = createServerEntity(
      minimalServerEntityConfig({ components: { health: { value: 10 } } }),
      minimalServerEntityConfig({
        components: { shareables: { allItems: true } },
      }),
    );

    expect(builder).toBeInstanceOf(ServerEntityBuilder);
    expect(builder.cloneConfig().components).toEqual({
      health: { value: 10 },
      shareables: { allItems: true },
    });
  });

  it('later config overrides earlier values', () => {
    const builder = createServerEntity(
      minimalServerEntityConfig({ identifier: 'test:first' }),
      minimalServerEntityConfig({ identifier: 'test:second' }),
    );

    expect(builder.cloneConfig().identifier).toBe('test:second');
  });

  it('merges ServerEntityBuilder with ServerEntityConfig', () => {
    const base = new ServerEntityBuilder(
      minimalServerEntityConfig({ components: { health: { value: 10 } } }),
    );
    const builder = createServerEntity(
      base,
      minimalServerEntityConfig({
        components: { shareables: { allItems: true } },
      }),
    );

    expect(builder.cloneConfig().components).toEqual({
      health: { value: 10 },
      shareables: { allItems: true },
    });
  });

  it('concatenates componentGroups arrays', () => {
    const builder = createServerEntity(
      minimalServerEntityConfig({
        componentGroups: [
          { name: 'baby', components: { health: { value: 5 } } },
        ],
      }),
      minimalServerEntityConfig({
        componentGroups: [
          { name: 'adult', components: { health: { value: 20 } } },
        ],
      }),
    );

    expect(builder.cloneConfig().componentGroups).toEqual([
      { name: 'baby', components: { health: { value: 5 } } },
      { name: 'adult', components: { health: { value: 20 } } },
    ]);
  });

  it('deep-merges events', () => {
    const builder = createServerEntity(
      minimalServerEntityConfig({
        events: {
          spawn: { trigger: 'minecraft:entity_spawned' },
        },
      }),
      minimalServerEntityConfig({
        events: {
          grow_up: { add: { componentGroups: ['adult'] } },
        },
      }),
    );

    expect(builder.cloneConfig().events).toEqual({
      spawn: { trigger: 'minecraft:entity_spawned' },
      grow_up: { add: { componentGroups: ['adult'] } },
    });
  });

  it('deep-merges nested behaviors', () => {
    const builder = createServerEntity(
      minimalServerEntityConfig({
        components: {
          behaviors: {
            float: { priority: 0 },
          },
        },
      }),
      minimalServerEntityConfig({
        components: {
          behaviors: {
            meleeAttack: { priority: 1 },
          },
        },
      }),
    );

    expect(builder.cloneConfig().components?.behaviors).toEqual({
      float: { priority: 0 },
      meleeAttack: { priority: 1 },
    });
  });
});
