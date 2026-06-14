import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { WEATHER_TYPES } from '../../constants/weather-type';
import { WeatherAtPositionFilter } from '../../interfaces/filters/weather-at-position-filter';

/**
 * Converts a WeatherAtPositionFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertWeatherAtPositionFilter = (
  filter: Partial<WeatherAtPositionFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertWithInputValues> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }

  return convertWithInputValues({
    ...filter,
    test: 'weather_at_position'
  }, WEATHER_TYPES, ctx);
};
