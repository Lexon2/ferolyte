import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { ClockTimeFilter } from '../../interfaces/filters/clock-time-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateNumberRange } from '../common/validation';

/**
 * Converts a ClockTimeFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertClockTimeFilter = (
  filter: Partial<ClockTimeFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Clock time must be between 0.0 and 1.0
  if (filter.value !== undefined && !validateNumberRange(filter.value, 0.0, 1.0, 'value', ctx)) {
    return undefined;
  }

  return convertNumberFilter({
    ...filter,
    test: 'clock_time',
  }, ctx);
};
