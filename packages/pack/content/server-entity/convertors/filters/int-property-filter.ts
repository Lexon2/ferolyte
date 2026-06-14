import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './common/convert-filter-base';
import { IntPropertyFilter } from '../../interfaces/filters/int-property-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateString, validateNumber } from '../common/validation';

/**
 * Converts an IntPropertyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIntPropertyFilter = (
  filter: Partial<IntPropertyFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate domain and value properties
  if (!filter.domain || !validateString(filter.domain, 'domain', ctx)) {
    return undefined;
  }

  if (filter.value === undefined || !validateNumber(filter.value, 'value', ctx)) {
    return undefined;
  }

  const baseResult = convertFilterBase(filter, ctx);
  if (!baseResult) {
    return undefined;
  }

  const result: MinecraftJsonFilter = {
    ...baseResult,
    test: 'int_property',
    domain: filter.domain,
    value: filter.value
  };

  return result;
};
