import { describe, it } from 'vitest';
import { createStorageWeightModifier } from '@ferolyte/pack/content/item/convertors/components/storage-weight-modifier';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createStorageWeightModifier', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createStorageWeightModifier);
  });

  it('returns undefined for negative weight', () => {
    expectUndefined(createStorageWeightModifier, { weightInStorageItem: -1 });
  });

  it('maps weight in storage item', () => {
    expectComponent(
      createStorageWeightModifier,
      { weightInStorageItem: 4 },
      'minecraft:storage_weight_modifier',
      {
        weight_in_storage_item: 4,
      },
    );
  });
});
