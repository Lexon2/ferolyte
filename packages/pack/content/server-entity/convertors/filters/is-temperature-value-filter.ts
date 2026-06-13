import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { IsTemperatureValueFilter } from '../../interfaces/filters/is-temperature-value-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateNumber } from '../common/validation';
import { convertNumberFilter } from './common/convert-number-filter';

/**
 * Converts an IsTemperatureValueFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsTemperatureValueFilter = (
  filter: Partial<IsTemperatureValueFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate that value is within valid range (0.0-1.0)
  if (filter.value !== undefined && !validateNumber(filter.value, 'value', 0.0, 1.0, ctx)) {
    return undefined;
  }

  return convertNumberFilter({
    ...filter,
    test: 'is_temperature_value'
  }, ctx);
};
