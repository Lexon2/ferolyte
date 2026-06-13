import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { LightLevelFilter } from '../../interfaces/filters/light-level-filter';

/**
 * Converts a LightLevelFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertLightLevelFilter = (
  filter: Partial<LightLevelFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertNumberFilter> | undefined => {
  if (!filter || filter.value === undefined) {
    return undefined;
  }
  return convertNumberFilter({
    ...filter,
    test: 'light_level'
  }, ctx);
};
