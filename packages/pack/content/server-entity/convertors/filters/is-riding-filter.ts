import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { IsRidingFilter } from '../../interfaces/filters/is-riding-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsRidingFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsRidingFilter = (
  filter: Partial<IsRidingFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter(
    {
      ...filter,
      test: 'is_riding',
    },
    ctx,
  );
};
