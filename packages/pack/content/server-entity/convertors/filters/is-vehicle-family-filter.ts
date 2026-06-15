import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { IsVehicleFamilyFilter } from '../../interfaces/filters/is-vehicle-family-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsVehicleFamilyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsVehicleFamilyFilter = (
  filter: Partial<IsVehicleFamilyFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter(
    {
      ...filter,
      test: 'is_vehicle_family',
    },
    ctx,
  );
};
