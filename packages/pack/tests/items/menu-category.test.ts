import { describe, expect, it } from 'vitest';
import {
  setContentDiagnosticSink,
  type ContentDiagnosticRecord,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ItemMenuCategoryGroup } from '@ferolyte/pack/content/item/types/item-menu-category-groups';
import {
  convertMenuCategory,
  validateCategory,
} from '@ferolyte/pack/content/item/convertors/components/menu-category/convert-category';

describe('validateCategory', () => {
  it('accepts valid categories', () => {
    expect(validateCategory('items')).toBe('items');
  });

  it('returns undefined for invalid category', () => {
    expect(validateCategory('invalid' as never)).toBeUndefined();
  });
});

describe('convertMenuCategory', () => {
  it('maps category and optional fields', () => {
    expect(
      convertMenuCategory({
        category: 'equipment',
        group: 'itemGroup.name.sword',
        isHiddenInCommands: true,
      }),
    ).toEqual({
      category: 'equipment',
      group: 'minecraft:itemGroup.name.sword',
      is_hidden_in_commands: true,
    });
  });

  it('returns undefined for invalid category', () => {
    expect(
      convertMenuCategory({ category: 'invalid' as never }),
    ).toBeUndefined();
  });
});

describe('menuCategory.group namespace', () => {
  const groupOf = (group: string) => {
    const records: ContentDiagnosticRecord[] = [];
    setContentDiagnosticSink((record) => records.push(record), { silent: true });
    try {
      const result = convertMenuCategory(
        { category: 'equipment', group: group as ItemMenuCategoryGroup },
        { contentType: 'item', component: 'menuCategory', diagnostics: true },
      ) as unknown as { group: string };

      return { group: result.group, errors: records.filter((r) => r.severity === 'error') };
    } finally {
      setContentDiagnosticSink(undefined);
    }
  };

  it('writes vanilla groups with the minecraft: prefix', () => {
    expect(groupOf('minecraft:itemGroup.name.chestplate')).toEqual({
      group: 'minecraft:itemGroup.name.chestplate',
      errors: [],
    });
    expect(groupOf('itemGroup.name.chestplate')).toEqual({
      group: 'minecraft:itemGroup.name.chestplate',
      errors: [],
    });
  });

  it('keeps namespaced custom groups', () => {
    expect(groupOf('myaddon:gems').group).toBe('myaddon:gems');
  });

  it('reports any other value without a namespace', () => {
    const { errors } = groupOf('gems');
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/must be prefixed with a namespace/);
  });

  it('types the prefixed form', () => {
    const ok: ItemMenuCategoryGroup[] = [
      'minecraft:itemGroup.name.chestplate',
      'itemGroup.name.sword',
      'myaddon:gems',
    ];
    // @ts-expect-error a group needs a namespace
    const bad: ItemMenuCategoryGroup = 'gems';
    expect([ok, bad]).toBeDefined();
  });
});
