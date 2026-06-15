import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { IsSittingFilter } from '../../interfaces/filters/is-sitting-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsSittingFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsSittingFilter = (
  filter: Partial<IsSittingFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter(
    {
      ...filter,
      test: 'is_sitting',
    },
    ctx,
  );
};
