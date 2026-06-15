import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { HomeDistanceFilter } from '../../interfaces/filters/home-distance-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateNumber } from '../common/validation';

/**
 * Converts a HomeDistanceFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHomeDistanceFilter = (
  filter: Partial<HomeDistanceFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate that value is a non-negative number
  if (
    filter.value !== undefined &&
    !validateNumber(filter.value, 'value', 0, ctx)
  ) {
    return undefined;
  }

  return convertNumberFilter(
    {
      ...filter,
      test: 'home_distance',
    },
    ctx,
  );
};
