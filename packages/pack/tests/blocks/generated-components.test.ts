import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';

const build = (components: Record<string, unknown>) => {
  const collector = collectDiagnostics({ silent: true });
  const block = new BlockBuilder({
    identifier: 'test:block',
    components: components as never,
  })
    .withBuildContext({ identifier: 'test:block', contentType: 'block' })
    .build();
  collector.stop();

  return {
    components: (block['minecraft:block'].components ?? {}) as Record<string, any>,
    errors: collector.records.filter((r) => r.severity === 'error'),
  };
};

describe('schema-generated block components', () => {
  it('accepts an item descriptor with tags in itemSpecificSpeeds (user bug)', () => {
    const { components, errors } = build({
      destructibleByMining: {
        secondsToDestroy: 2,
        itemSpecificSpeeds: [
          { item: { tags: "q.any_tag('minecraft:is_axe')" }, destroySpeed: 1 },
          { item: 'minecraft:stick', destroySpeed: 2 },
        ],
      },
    });

    expect(errors).toEqual([]);
    expect(components['minecraft:destructible_by_mining']).toEqual({
      seconds_to_destroy: 2,
      item_specific_speeds: [
        { item: { tags: "q.any_tag('minecraft:is_axe')" }, destroy_speed: 1 },
        { item: 'minecraft:stick', destroy_speed: 2 },
      ],
    });
  });

  it('writes tags as tag:* keys', () => {
    expect(build({ tags: ['a', 'b'] }).components).toEqual({
      'tag:a': {},
      'tag:b': {},
    });
  });

  it('turns displayName into the generated language key', () => {
    expect(
      build({ displayName: 'Name' }).components['minecraft:display_name'],
    ).toBe('tile.test:block.name');
  });

  it('keeps boolean | object forms', () => {
    const { components, errors } = build({
      collisionBox: false,
      selectionBox: { origin: [0, 0, 0], size: [1, 1, 1] },
      friction: 0.5,
    });

    expect(errors).toEqual([]);
    expect(components['minecraft:collision_box']).toBe(false);
    expect(components['minecraft:friction']).toBe(0.5);
  });

  it('does not write unknown fields', () => {
    const { components, errors } = build({ friction: 0.5, nope: 1 });

    expect(components['minecraft:friction']).toBe(0.5);
    expect(components.nope).toBeUndefined();
    expect(errors).toHaveLength(1);
  });

  it.each([
    ['instrumentSound', { up: 'note.harp' }, 'minecraft:instrument_sound'],
    ['blockEntity', { dynamicProperties: true }, 'minecraft:block_entity'],
    ['sound', { sound: 'stone' }, 'minecraft:sound'],
  ])('supports %s', (key, config, minecraftKey) => {
    const { components, errors } = build({ [key]: config });

    expect(errors).toEqual([]);
    expect(components[minecraftKey]).toBeDefined();
  });

  it('supports geometry nWayVisualRotation', () => {
    const { components, errors } = build({
      geometry: { identifier: 'geometry.test', nWayVisualRotation: { y: 'a:b' } },
    });

    expect(errors).toEqual([]);
    expect(components['minecraft:geometry']).toEqual({
      identifier: 'geometry.test',
      n_way_visual_rotation: { y: 'a:b' },
    });
  });
});
