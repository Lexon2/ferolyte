import { describe, it } from 'vitest';

import { convertHasSameEquipmentInSlotAsFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/has-same-equipment-in-slot-as-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertHasSameEquipmentInSlotAsFilter', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertHasSameEquipmentInSlotAsFilter);
  });

  it('returns undefined for invalid domain', () => {
    expectUndefined(convertHasSameEquipmentInSlotAsFilter, {
      domain: 'invalid' as never,
      value: true,
    });
  });

  it('maps has_same_equipment_in_slot_as filter', () => {
    expectFilter(
      convertHasSameEquipmentInSlotAsFilter,
      {
        domain: 'head',
        value: true,
        subject: 'other',
      },
      {
        test: 'has_same_equipment_in_slot_as',
        domain: 'head',
        value: true,
        subject: 'other',
      },
    );
  });
});
