import { describe, it } from 'vitest';
import { createStorageWeightLimit } from '@ferolyte/pack/content/item/convertors/components/storage-weight-limit';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createStorageWeightLimit', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createStorageWeightLimit);
  });

  it('returns undefined for invalid maxWeightLimit', () => {
    expectUndefined(createStorageWeightLimit, { maxWeightLimit: 0 });
  });

  it('maps max weight limit', () => {
    expectComponent(
      createStorageWeightLimit,
      { maxWeightLimit: 32 },
      'minecraft:storage_weight_limit',
      {
        max_weight_limit: 32,
      },
    );
  });
});
