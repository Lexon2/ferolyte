import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { IsMarkVariantFilter } from '../../interfaces/filters/is-mark-variant-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsMarkVariantFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsMarkVariantFilter = (
  filter: Partial<IsMarkVariantFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertNumberFilter(
    {
      ...filter,
      test: 'is_mark_variant',
    },
    ctx,
  );
};
