import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { WEATHER_TYPES } from '../../constants/weather-type';
import { WeatherFilter } from '../../interfaces/filters/weather-filter';

/**
 * Converts a WeatherFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertWeatherFilter = (
  filter: Partial<WeatherFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertWithInputValues> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }

  return convertWithInputValues({
    ...filter,
    test: 'weather'
  }, WEATHER_TYPES, ctx);
};
