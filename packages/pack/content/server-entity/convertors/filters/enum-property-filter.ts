import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EnumPropertyFilter } from '../../interfaces/filters/enum-property-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateString } from '../common/validation';
import { convertFilterBase } from './common/convert-filter-base';

/**
 * Converts an EnumPropertyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertEnumPropertyFilter = (
  filter: Partial<EnumPropertyFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate domain and value properties
  if (!filter.domain || !validateString(filter.domain, 'domain', ctx)) {
    return undefined;
  }

  if (filter.value === undefined || !validateString(filter.value, 'value', ctx)) {
    return undefined;
  }

  const baseResult = convertFilterBase(filter, ctx);
  if (!baseResult) {
    return undefined;
  }

  const result: MinecraftJsonFilter = {
    ...baseResult,
    test: 'enum_property',
    domain: filter.domain,
    value: filter.value
  };

  return result;
};
