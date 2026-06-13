import { describe, it } from 'vitest';
import { createStorageItem } from '@artifex/pack/content/item/convertors/components/storage-item';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createStorageItem', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createStorageItem);
  });

  it('returns undefined for invalid maxSlots', () => {
    expectUndefined(createStorageItem, { maxSlots: 0 });
  });

  it('maps storage item fields', () => {
    expectComponent(createStorageItem, {
      allowNestedStorageItems: true,
      maxSlots: 8,
      allowedItems: ['minecraft:apple'],
      bannedItems: ['minecraft:rotten_flesh'],
    }, 'minecraft:storage_item', {
      allow_nested_storage_items: true,
      max_slots: 8,
      allowed_items: ['minecraft:apple'],
      banned_items: ['minecraft:rotten_flesh'],
    });
  });
});
