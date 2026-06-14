import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { HourlyClockTimeFilter } from '../../interfaces/filters/hourly-clock-time-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateNumber } from '../common/validation';

/**
 * Converts a HourlyClockTimeFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHourlyClockTimeFilter = (
  filter: Partial<HourlyClockTimeFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate that value is within valid range (0-24000)
  if (filter.value !== undefined && !validateNumber(filter.value, 'value', 0, 24000, ctx)) {
    return undefined;
  }

  return convertNumberFilter({
    ...filter,
    test: 'hourly_clock_time',
  }, ctx);
};
