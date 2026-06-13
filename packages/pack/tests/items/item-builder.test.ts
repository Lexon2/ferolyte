import { describe, expect, it } from 'vitest';
import { ItemBuilder } from '@artifex/pack/content/item/item-builder';
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
    const item = new ItemBuilder(minimalItemConfig({ version: '1.21.90' })).build();
    expect(item.format_version).toBe('1.21.90');
  });

  it('maps isExperimental and menuCategory', () => {
    const item = new ItemBuilder(minimalItemConfig({
      isExperimental: true,
      menuCategory: { category: 'nature' },
    })).build();

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
    const item = new ItemBuilder(minimalItemConfig({
      components: {
        displayName: 'Stone',
        maxStackSize: 64,
        glint: true,
      },
    })).build();

    expect(item['minecraft:item'].components).toEqual({
      'minecraft:display_name': { value: 'Stone' },
      'minecraft:max_stack_size': 64,
      'minecraft:glint': true,
    });
  });

  it('passes through unknown components', () => {
    const item = new ItemBuilder(minimalItemConfig({
      components: {
        'test:custom_component': { value: 1 },
      },
    })).build();

    expect(item['minecraft:item'].components).toEqual({
      'test:custom_component': { value: 1 },
    });
  });

  it('skips invalid components', () => {
    const item = new ItemBuilder(minimalItemConfig({
      components: {
        displayName: '',
        glint: true,
      },
    })).build();

    expect(item['minecraft:item'].components).toEqual({
      'minecraft:glint': true,
    });
  });

  it('clones config independently', () => {
    const builder = new ItemBuilder(minimalItemConfig({ components: { glint: true } }));
    const clone = builder.cloneConfig();
    clone.components = { glint: false };

    expect(builder.cloneConfig().components?.glint).toBe(true);
  });
});
