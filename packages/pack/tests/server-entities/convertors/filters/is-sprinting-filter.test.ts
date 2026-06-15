import { describe, it } from 'vitest';

import { convertIsSprintingFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/is-sprinting-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsSprintingFilter', () => {
  it('returns test-only filter when value is omitted', () => {
    expectFilter(
      convertIsSprintingFilter,
      {},
      {
        test: 'is_sprinting',
      },
    );
  });

  it('maps is_sprinting filter', () => {
    expectFilter(
      convertIsSprintingFilter,
      {
        value: false,
      },
      {
        test: 'is_sprinting',
        value: false,
      },
    );
  });
});
