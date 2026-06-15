import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './common/convert-filter-base';
import { FILTER_EQUIPMENT_SLOTS } from '../../constants/equipment-slots';
import { HasEquipmentTagFilter } from '../../interfaces/filters/has-equipment-tag-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateString } from '../common/validation';
import { validateAllowedValues } from '../common/validation';

/**
 * Converts a HasEquipmentTagFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasEquipmentTagFilter = (
  filter: Partial<HasEquipmentTagFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate value property
  if (
    filter.value === undefined ||
    !validateString(filter.value, 'value', ctx)
  ) {
    return undefined;
  }

  // Validate optional domain property
  if (
    filter.domain !== undefined &&
    !validateAllowedValues(filter.domain, FILTER_EQUIPMENT_SLOTS, 'domain', ctx)
  ) {
    return undefined;
  }

  const baseResult = convertFilterBase(filter, ctx);
  if (!baseResult) {
    return undefined;
  }

  const result: MinecraftJsonFilter = {
    ...baseResult,
    test: 'has_equipment_tag',
    value: filter.value,
  };

  if (filter.domain !== undefined) {
    result.domain = filter.domain;
  }

  return result;
};
