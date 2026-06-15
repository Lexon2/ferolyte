import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { DistanceToNearestPlayerFilter } from '../../interfaces/filters/distance-to-nearest-player-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a DistanceToNearestPlayerFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertDistanceToNearestPlayerFilter = (
  filter: Partial<DistanceToNearestPlayerFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertNumberFilter(
    {
      ...filter,
      test: 'distance_to_nearest_player',
    },
    ctx,
  );
};
