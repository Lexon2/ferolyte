import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { IsControllingPassengerFamilyFilter } from '../../interfaces/filters/is-controlling-passenger-family-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsControllingPassengerFamilyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsControllingPassengerFamilyFilter = (
  filter: Partial<IsControllingPassengerFamilyFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter(
    {
      ...filter,
      test: 'is_controlling_passenger_family',
    },
    ctx,
  );
};
