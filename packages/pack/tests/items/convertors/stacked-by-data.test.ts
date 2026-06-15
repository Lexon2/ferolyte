import { describe, expect, it } from 'vitest';
import { createStackedByData } from '@ferolyte/pack/content/item/convertors/components/stacked-by-data';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createStackedByData', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createStackedByData);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createStackedByData, 'invalid');
  });

  it('maps valid boolean to minecraft:stacked_by_data', () => {
    expectComponent(
      createStackedByData,
      true,
      'minecraft:stacked_by_data',
      true,
    );
    expectComponent(
      createStackedByData,
      false,
      'minecraft:stacked_by_data',
      false,
    );
  });
});
