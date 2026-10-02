import { afterEach, describe, expect, it, vi } from 'vitest';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import { minimalItemConfig } from './helpers/fixtures';

describe('ItemBuilder', () => {
  it('builds minimal item structure', () => {
    const item = new ItemBuilder(minimalItemConfig()).build();

    expect(item).toEqual({
      format_version: '1.21.70',
      'minecraft:item': {
        description: {
          identifier: 'test:item',
        },
      },
    });
  });

  it('uses custom version', () => {
    const item = new ItemBuilder(
      minimalItemConfig({ version: '1.21.90' }),
    ).build();
    expect(item.format_version).toBe('1.21.90');
  });

  it('maps isExperimental and menuCategory', () => {
    const item = new ItemBuilder(
      minimalItemConfig({
        isExperimental: true,
        menuCategory: { category: 'nature' },
      }),
    ).build();

    expect(item['minecraft:item'].description).toEqual({
      identifier: 'test:item',
      is_experimental: true,
      menu_category: { category: 'nature' },
    });
  });

  it('omits components when empty', () => {
    const item = new ItemBuilder(minimalItemConfig({ components: {} })).build();
    expect(item['minecraft:item'].components).toBeUndefined();
  });

  it('converts registered components through factory', () => {
    const item = new ItemBuilder(
      minimalItemConfig({
        components: {
          displayName: 'Stone',
          maxStackSize: 64,
          glint: true,
        },
      }),
    ).build();

    expect(item['minecraft:item'].components).toEqual({
      'minecraft:display_name': { value: 'Stone' },
      'minecraft:max_stack_size': 64,
      'minecraft:glint': true,
    });
  });

  it('passes through rawComponents', () => {
    const item = new ItemBuilder(
      minimalItemConfig({
        rawComponents: {
          'test:custom_component': { value: 1 },
        },
      }),
    ).build();

    expect(item['minecraft:item'].components).toEqual({
      'test:custom_component': { value: 1 },
    });
  });

  it('skips invalid components', () => {
    const item = new ItemBuilder(
      minimalItemConfig({
        components: {
          displayName: '',
          glint: true,
        },
      }),
    ).build();

    expect(item['minecraft:item'].components).toEqual({
      'minecraft:glint': true,
    });
  });

  it('clones config independently', () => {
    const builder = new ItemBuilder(
      minimalItemConfig({ components: { glint: true } }),
    );
    const clone = builder.cloneConfig();
    clone.components = { glint: false };

    expect(builder.cloneConfig().components?.glint).toBe(true);
  });

  it('passes icon texture key through unchanged', () => {
    const builder = new ItemBuilder(
      minimalItemConfig({
        identifier: 'ferolyte:test',
        components: { icon: 'my_texture_key' },
      }),
    );

    expect(builder.build()['minecraft:item'].components).toEqual({
      'minecraft:icon': { textures: { default: 'my_texture_key' } },
    });
  });

  describe('components requirement (1.26.30+)', () => {
    afterEach(() => vi.restoreAllMocks());

    it('reports an error for an empty item with format_version >= 1.26.30', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      new ItemBuilder({ ...minimalItemConfig(), version: '1.26.30' }).build();

      expect(error).toHaveBeenCalledOnce();
      expect(error.mock.calls[0][0]).toContain('at least one component');
    });

    it('does not report for older versions or items with components', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      new ItemBuilder({ ...minimalItemConfig(), version: '1.26.20' }).build();
      new ItemBuilder({
        ...minimalItemConfig(),
        version: '1.26.40',
        components: { maxStackSize: 16 },
      }).build();

      expect(error).not.toHaveBeenCalled();
    });
  });

  it('emits isExperimental as description.is_experimental', () => {
    const item = new ItemBuilder({
      ...minimalItemConfig(),
      isExperimental: true,
    }).build();

    expect(item['minecraft:item'].description.is_experimental).toBe(true);
  });
});

describe('ItemBuilder displayName with identifier context', () => {
  it('references the generated lang key', () => {
    const item = new ItemBuilder(
      minimalItemConfig({ components: { displayName: 'Stone' } }),
    )
      .withBuildContext({ identifier: 'test:item' })
      .build();

    expect(item['minecraft:item'].components).toEqual({
      'minecraft:display_name': { value: 'item.test:item' },
    });
  });
});
