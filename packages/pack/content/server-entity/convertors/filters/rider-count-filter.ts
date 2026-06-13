import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { RiderCountFilter } from '../../interfaces/filters/rider-count-filter';

/**
 * Converts a RiderCountFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertRiderCountFilter = (
  filter: Partial<RiderCountFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertNumberFilter> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }
  return convertNumberFilter({
    ...filter,
    test: 'rider_count'
  }, ctx);
};
