import { describe, expect, it } from 'vitest';
import { createItem } from '@ferolyte/pack/content/item/create-item';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import { minimalItemConfig } from './helpers/fixtures';

describe('createItem', () => {
  it('merges multiple ItemConfig objects', () => {
    const builder = createItem(
      minimalItemConfig({ components: { glint: true } }),
      minimalItemConfig({ components: { maxStackSize: 16 } }),
    );

    expect(builder).toBeInstanceOf(ItemBuilder);
    expect(builder.cloneConfig().components).toEqual({
      glint: true,
      maxStackSize: 16,
    });
  });

  it('later config overrides earlier values', () => {
    const builder = createItem(
      minimalItemConfig({ identifier: 'test:first' }),
      minimalItemConfig({ identifier: 'test:second' }),
    );

    expect(builder.cloneConfig().identifier).toBe('test:second');
  });

  it('merges ItemBuilder with ItemConfig', () => {
    const base = new ItemBuilder(
      minimalItemConfig({ components: { glint: true } }),
    );
    const builder = createItem(
      base,
      minimalItemConfig({ components: { maxStackSize: 32 } }),
    );

    expect(builder.cloneConfig().components).toEqual({
      glint: true,
      maxStackSize: 32,
    });
  });
});
