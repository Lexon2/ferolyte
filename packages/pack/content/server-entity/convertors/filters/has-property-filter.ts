import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { HasPropertyFilter } from '../../interfaces/filters/has-property-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a HasPropertyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasPropertyFilter = (
  filter: Partial<HasPropertyFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter(
    {
      ...filter,
      test: 'has_property',
    },
    ctx,
  );
};
