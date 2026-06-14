import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { TEMPERATURE_TYPES } from '../../constants/temperature-types';
import { IsTemperatureTypeFilter } from '../../interfaces/filters/is-temperature-type-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsTemperatureTypeFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsTemperatureTypeFilter = (
  filter: Partial<IsTemperatureTypeFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues({
      ...filter,
      test: 'is_temperature_type'
    },
    TEMPERATURE_TYPES, ctx);
};
