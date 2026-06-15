import { describe, it } from 'vitest';

import { convertYRotationFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/y-rotation-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertYRotationFilter', () => {
  it('returns undefined when value is missing', () => {
    expectUndefined(convertYRotationFilter, {});
  });

  it('returns undefined for non-number value', () => {
    expectUndefined(convertYRotationFilter, { value: '90' as never });
  });

  it('maps y_rotation filter', () => {
    expectFilter(
      convertYRotationFilter,
      {
        value: 90,
        operator: 'equals',
      },
      {
        test: 'y_rotation',
        value: 90,
        operator: 'equals',
      },
    );
  });
});
