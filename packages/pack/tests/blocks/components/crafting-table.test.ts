import { describe, it } from 'vitest';
import { createCraftingTable } from '@artifex/pack/content/block/components/crafting-table';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCraftingTable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCraftingTable);
  });

  it('returns undefined for empty table name', () => {
    expectUndefined(createCraftingTable, { tableName: '' });
  });

  it('maps crafting table fields', () => {
    expectComponent(createCraftingTable, {
      craftingTags: ['crafting_table'],
      tableName: 'Custom Table',
    }, 'minecraft:crafting_table', {
      crafting_tags: ['crafting_table'],
      table_name: 'Custom Table',
    });
  });
});
