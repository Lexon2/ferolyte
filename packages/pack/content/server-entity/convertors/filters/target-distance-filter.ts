import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { TargetDistanceFilter } from '../../interfaces/filters/target-distance-filter';

/**
 * Converts a TargetDistanceFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertTargetDistanceFilter = (
  filter: Partial<TargetDistanceFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertNumberFilter> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }
  return convertNumberFilter({
    ...filter,
    test: 'target_distance'
  }, ctx);
};
