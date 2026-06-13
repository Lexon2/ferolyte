import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { FILTER_EQUIPMENT_SLOTS } from '../../constants/equipment-slots';
import { HasSameEquipmentInSlotAsFilter } from '../../interfaces/filters/has-same-equipment-in-slot-as-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateAllowedValues } from '../common/validation';

/**
 * Converts a HasSameEquipmentInSlotAsFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasSameEquipmentInSlotAsFilter = (
  filter: Partial<HasSameEquipmentInSlotAsFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  if (
    filter.domain !== undefined &&
    !validateAllowedValues(filter.domain, FILTER_EQUIPMENT_SLOTS, 'domain', ctx)
  ) {
    return undefined;
  }

  const result = convertBooleanFilter({
    ...filter,
    test: 'has_same_equipment_in_slot_as',
  }, ctx);

  if (!result) {
    return undefined;
  }

  if (filter.domain !== undefined) {
    result.domain = filter.domain;
  }

  return result;
};
