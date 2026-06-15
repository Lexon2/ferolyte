import { describe, expect, it } from 'vitest';
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
      group: 'itemGroup.name.sword',
      is_hidden_in_commands: true,
    });
  });

  it('returns undefined for invalid category', () => {
    expect(
      convertMenuCategory({ category: 'invalid' as never }),
    ).toBeUndefined();
  });
});
