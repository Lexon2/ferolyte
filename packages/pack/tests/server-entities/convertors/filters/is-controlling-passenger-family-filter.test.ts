import { describe, it } from 'vitest';

import { convertIsControllingPassengerFamilyFilter } from '@artifex/pack/content/server-entity/convertors/filters/is-controlling-passenger-family-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsControllingPassengerFamilyFilter', () => {
  it('returns undefined when value is missing', () => {
    expectUndefined(convertIsControllingPassengerFamilyFilter, {});
  });

  it('maps is_controlling_passenger_family filter', () => {
    expectFilter(convertIsControllingPassengerFamilyFilter, {
      value: 'player',
    }, {
      test: 'is_controlling_passenger_family',
      value: 'player',
    });
  });
});
