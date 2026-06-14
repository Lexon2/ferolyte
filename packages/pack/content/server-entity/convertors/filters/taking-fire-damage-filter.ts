import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { TakingFireDamageFilter } from '../../interfaces/filters/taking-fire-damage-filter';

/**
 * Converts a TakingFireDamageFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertTakingFireDamageFilter = (
  filter: Partial<TakingFireDamageFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertBooleanFilter> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }
  return convertBooleanFilter({
    ...filter,
    test: 'taking_fire_damage'
  }, ctx);
};
