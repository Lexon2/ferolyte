import { describe, it } from 'vitest';

import { convertHasItemWithComponentFilter } from '@artifex/pack/content/server-entity/convertors/filters/has-item-with-component-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertHasItemWithComponentFilter', () => {
  it('returns undefined when value is missing', () => {
    expectUndefined(convertHasItemWithComponentFilter, {});
  });

  it('returns undefined for non-string value', () => {
    expectUndefined(convertHasItemWithComponentFilter, { value: 123 as never });
  });

  it('maps has_item_with_component filter', () => {
    expectFilter(convertHasItemWithComponentFilter, {
      value: 'minecraft:food',
      subject: 'self',
      operator: 'equals',
    }, {
      test: 'has_item_with_component',
      value: 'minecraft:food',
      subject: 'self',
      operator: 'equals',
    });
  });
});
