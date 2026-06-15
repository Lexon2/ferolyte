import { describe, it } from 'vitest';

import { convertIsRidingSelfFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/is-riding-self-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsRidingSelfFilter', () => {
  it('returns test-only filter when value is omitted', () => {
    expectFilter(
      convertIsRidingSelfFilter,
      {},
      {
        test: 'is_riding_self',
      },
    );
  });

  it('maps is_riding_self filter', () => {
    expectFilter(
      convertIsRidingSelfFilter,
      {
        value: true,
        operator: 'equals',
      },
      {
        test: 'is_riding_self',
        value: true,
        operator: 'equals',
      },
    );
  });
});
