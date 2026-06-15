import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './common/convert-filter-base';
import { FILTER_EQUIPMENT_SLOTS } from '../../constants/equipment-slots';
import { HasNametagFilter } from '../../interfaces/filters/has-nametag-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateBoolean } from '../common/validation';
import { validateAllowedValues } from '../common/validation';

/**
 * Converts a HasNametagFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasNametagFilter = (
  filter: Partial<HasNametagFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate value property
  if (
    filter.value === undefined ||
    !validateBoolean(filter.value, 'value', ctx)
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
    test: 'has_nametag',
    value: filter.value,
  };

  if (filter.domain !== undefined) {
    result.domain = filter.domain;
  }

  return result;
};
