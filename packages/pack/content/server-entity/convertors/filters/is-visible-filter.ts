import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { IsVisibleFilter } from '../../interfaces/filters/is-visible-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsVisibleFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsVisibleFilter = (
  filter: Partial<IsVisibleFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter(
    {
      ...filter,
      test: 'is_visible',
    },
    ctx,
  );
};
