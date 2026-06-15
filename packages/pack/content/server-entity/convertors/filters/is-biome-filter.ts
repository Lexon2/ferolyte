import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { IsBiomeFilter } from '../../interfaces/filters/is-biome-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsBiomeFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsBiomeFilter = (
  filter: Partial<IsBiomeFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter(
    {
      ...filter,
      test: 'is_biome',
    },
    ctx,
  );
};
