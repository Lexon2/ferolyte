import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { COLORS } from '../../constants/colors';
import { IsColorFilter } from '../../interfaces/filters/is-color-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsColorFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsColorFilter = (
  filter: Partial<IsColorFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues(
    {
      ...filter,
      test: 'is_color',
    },
    COLORS,
    ctx,
  );
};
