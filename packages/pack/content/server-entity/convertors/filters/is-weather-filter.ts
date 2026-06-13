import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { WEATHER_TYPES } from '../../constants/weather-type';
import { IsWeatherFilter } from '../../interfaces/filters/is-weather-filter';

/**
 * Converts an IsWeatherFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsWeatherFilter = (
  filter: Partial<IsWeatherFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertWithInputValues> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }

  return convertWithInputValues({
    ...filter,
    test: 'is_weather',
  }, WEATHER_TYPES, ctx);
};
