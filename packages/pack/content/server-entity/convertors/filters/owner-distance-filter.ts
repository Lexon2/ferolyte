import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { OwnerDistanceFilter } from '../../interfaces/filters/owner-distance-filter';

/**
 * Converts a OwnerDistanceFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertOwnerDistanceFilter = (
  filter: Partial<OwnerDistanceFilter>,
  ctx?: ContentDiagnosticContext,
): ReturnType<typeof convertNumberFilter> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }
  return convertNumberFilter(
    {
      ...filter,
      test: 'owner_distance',
    },
    ctx,
  );
};
