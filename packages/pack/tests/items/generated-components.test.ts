import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';

const build = (components: Record<string, unknown>) => {
  const collector = collectDiagnostics({ silent: true });
  const item = new ItemBuilder({
    identifier: 'test:item',
    components: components as never,
  })
    .withBuildContext({ identifier: 'test:item', contentType: 'item' })
    .build();
  collector.stop();

  return {
    components: (item['minecraft:item'].components ?? {}) as Record<string, any>,
    errors: collector.records.filter((r) => r.severity === 'error'),
    warnings: collector.records.filter((r) => r.severity === 'warning'),
  };
};

describe('schema-generated item components', () => {
  it('renames camelCase keys and validates', () => {
    const { components, errors } = build({
      maxStackSize: 16,
      durability: { maxDurability: 10, damageChance: { min: 1, max: 2 } },
    });

    expect(errors).toEqual([]);
    expect(components['minecraft:max_stack_size']).toBe(16);
    expect(components['minecraft:durability']).toEqual({
      max_durability: 10,
      damage_chance: { min: 1, max: 2 },
    });
  });

  it('reports unknown fields with a hint and does not write them', () => {
    const { components, errors } = build({ durability: { max_durability: 10 } });

    expect(components['minecraft:durability']).toEqual({});
    expect(errors[0].message).toContain('Did you mean "maxDurability"');
  });

  it('keeps invalid values of known fields and reports them', () => {
    const { components, errors } = build({ maxStackSize: 'many' });

    expect(components['minecraft:max_stack_size']).toBe('many');
    expect(errors).toHaveLength(1);
  });

  it('expands icon sugar and warns about texture paths', () => {
    const plain = build({ icon: 'my_item' });
    expect(plain.components['minecraft:icon']).toEqual({
      textures: { default: 'my_item' },
    });

    const path = build({ icon: 'textures/items/x' });
    expect(path.warnings).toHaveLength(1);
  });

  it('turns displayName into the generated language key', () => {
    expect(
      build({ displayName: 'Name' }).components['minecraft:display_name'],
    ).toEqual({ value: 'item.test:item' });
  });

  it('accepts a list for tags', () => {
    expect(build({ tags: ['minecraft:arrow'] }).components['minecraft:tags']).toEqual({
      tags: ['minecraft:arrow'],
    });
  });

  it('passes namespaced custom components through', () => {
    expect(build({ 'test:custom': { a: 1 } }).components['test:custom']).toEqual({
      a: 1,
    });
  });

  it('supports item descriptors with tags (round-trip bug)', () => {
    const { errors, components } = build({
      digger: {
        destroySpeeds: [{ block: { tags: "q.any_tag('minecraft:logs')" }, speed: 2 }],
      },
    });

    expect(errors).toEqual([]);
    expect(components['minecraft:digger']).toEqual({
      destroy_speeds: [{ block: { tags: "q.any_tag('minecraft:logs')" }, speed: 2 }],
    });
  });
});
