import { describe, it } from 'vitest';

import { convertIsTamedFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/is-tamed-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsTamedFilter', () => {
  it('returns test-only filter when value is omitted', () => {
    expectFilter(
      convertIsTamedFilter,
      {},
      {
        test: 'is_tamed',
      },
    );
  });

  it('maps is_tamed filter', () => {
    expectFilter(
      convertIsTamedFilter,
      {
        value: true,
        subject: 'self',
      },
      {
        test: 'is_tamed',
        value: true,
        subject: 'self',
      },
    );
  });
});
