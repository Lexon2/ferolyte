import { describe, it } from 'vitest';

import { convertShareablesComponent } from '@artifex/pack/content/server-entity/convertors/components/miscellaneous/shareables-component.convertor';

import { expectComponent, expectUndefined } from '../../helpers/assert-component';

describe('convertShareablesComponent', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertShareablesComponent);
  });

  it('returns undefined for invalid allItems type', () => {
    expectUndefined(convertShareablesComponent, {
      allItems: 'yes' as never,
    });
  });

  it('maps shareables with global and item settings', () => {
    expectComponent(
      convertShareablesComponent,
      {
        allItems: true,
        allItemsMaxAmount: 8,
        singularPickup: false,
        items: [
          {
            item: 'minecraft:emerald',
            maxAmount: 4,
            priority: 1,
          },
        ],
      },
      'minecraft:shareables',
      {
        all_items: true,
        all_items_max_amount: 8,
        singular_pickup: false,
        items: [
          {
            item: 'minecraft:emerald',
            max_amount: 4,
            priority: 1,
          },
        ],
      },
    );
  });

  it('returns empty object for marker-style config', () => {
    expectComponent(convertShareablesComponent, {}, 'minecraft:shareables', {});
  });
});
