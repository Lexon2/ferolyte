import { describe, it } from 'vitest';

import { convertIsVehicleFamilyFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/is-vehicle-family-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsVehicleFamilyFilter', () => {
  it('returns undefined when value is missing', () => {
    expectUndefined(convertIsVehicleFamilyFilter, {});
  });

  it('maps is_vehicle_family filter', () => {
    expectFilter(
      convertIsVehicleFamilyFilter,
      {
        value: 'boat',
      },
      {
        test: 'is_vehicle_family',
        value: 'boat',
      },
    );
  });
});
