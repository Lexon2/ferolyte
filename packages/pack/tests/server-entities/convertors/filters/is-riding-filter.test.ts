import { describe, it } from 'vitest';

import { convertIsRidingFilter } from '@artifex/pack/content/server-entity/convertors/filters/is-riding-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsRidingFilter', () => {
  it('returns test-only filter when value is omitted', () => {
    expectFilter(convertIsRidingFilter, {}, {
      test: 'is_riding',
    });
  });

  it('maps is_riding filter', () => {
    expectFilter(convertIsRidingFilter, {
      value: true,
    }, {
      test: 'is_riding',
      value: true,
    });
  });
});
