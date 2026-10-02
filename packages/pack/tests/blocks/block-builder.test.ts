import { describe, expect, it, vi } from 'vitest';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { minimalBlockConfig } from './helpers/fixtures';

describe('BlockBuilder', () => {
  it('builds minimal block structure', () => {
    const block = new BlockBuilder(minimalBlockConfig()).build();

    expect(block).toEqual({
      format_version: '1.21.70',
      'minecraft:block': {
        description: {
          identifier: 'test:block',
        },
      },
    });
  });

  it('returns file name from identifier', () => {
    expect(
      new BlockBuilder(
        minimalBlockConfig({ identifier: 'test:my_block' }),
      ).fileName(),
    ).toBe('my_block.block.json');
  });

  it('uses custom version and menu category', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({
        version: '1.21.90',
        menuCategory: { category: 'construction' },
      }),
    ).build();

    expect(block.format_version).toBe('1.21.90');
    expect(block['minecraft:block'].description.menu_category).toEqual({
      category: 'construction',
    });
  });

  it('converts registered components', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({
        components: {
          displayName: 'Test Block',
          replaceable: true,
          friction: 0.6,
        },
      }),
    ).build();

    expect(block['minecraft:block'].components).toEqual({
      'minecraft:display_name': 'Test Block',
      'minecraft:replaceable': {},
      'minecraft:friction': 0.6,
    });
  });

  it('omits components section when conversion returns undefined', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({ components: {} }),
    ).build();
    expect(block['minecraft:block'].components).toBeUndefined();
  });

  it('passes through rawComponents', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({
        rawComponents: {
          'test:custom_component': { value: 1 },
        },
      }),
    ).build();

    expect(block['minecraft:block'].components).toEqual({
      'test:custom_component': { value: 1 },
    });
  });

  it('maps states and traits into description', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({
        states: { direction: ['north', 'south'] },
        traits: {
          placementDirection: { states: ['minecraft:cardinal_direction'] },
        },
      }),
    ).build();

    expect(block['minecraft:block'].description.states).toEqual({
      direction: ['north', 'south'],
    });
    expect(block['minecraft:block'].description.traits).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:cardinal_direction'],
        y_rotation_offset: undefined,
      },
    });
  });

  it('maps permutations', () => {
    const block = new BlockBuilder(
      minimalBlockConfig({
        permutations: [
          {
            condition: { states: { enabled: [true] } },
            components: { replaceable: true },
          },
        ],
      }),
    ).build();

    expect(block['minecraft:block'].permutations).toEqual([
      {
        condition: "(query.block_state('enabled'))",
        components: { 'minecraft:replaceable': {} },
      },
    ]);
  });

  it('clones config independently', () => {
    const builder = new BlockBuilder(
      minimalBlockConfig({ components: { replaceable: true } }),
    );
    const clone = builder.cloneConfig();
    clone.components = { replaceable: false };

    expect(builder.cloneConfig().components?.replaceable).toBe(true);
  });

  it('defaults format_version by minGameVersion', () => {
    const build = (minGameVersion?: string) =>
      new BlockBuilder({ identifier: 'test:block' })
        .withBuildContext({ minGameVersion })
        .build().format_version;

    expect(build()).toBe('1.21.70');
    expect(build('1.26.20')).toBe('1.21.70');
    expect(build('1.26.40')).toBe('1.26.40');
    expect(build('1.26.50')).toBe('1.26.50');
    expect(build('1.27.0')).toBe('1.26.50');
  });

  it('passes components to the multi block trait validation', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const block = new BlockBuilder({
      identifier: 'test:block',
      traits: { multiBlock: { direction: 'north' } },
      components: { randomOffset: { x: { steps: 2 } } },
    }).build();

    expect(block['minecraft:block'].description.traits).toEqual({});
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
