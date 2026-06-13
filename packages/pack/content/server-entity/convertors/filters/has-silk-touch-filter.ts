import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { HasSilkTouchFilter } from '../../interfaces/filters/has-silk-touch-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a HasSilkTouchFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasSilkTouchFilter = (
  filter: Partial<HasSilkTouchFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter({
    ...filter,
    test: 'has_silk_touch'
  }, ctx);
};
