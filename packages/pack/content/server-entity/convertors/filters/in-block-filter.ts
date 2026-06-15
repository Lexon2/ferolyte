import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { InBlockFilter } from '../../interfaces/filters/in-block-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an InBlockFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertInBlockFilter = (
  filter: Partial<InBlockFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter(
    {
      ...filter,
      test: 'in_block',
    },
    ctx,
  );
};
