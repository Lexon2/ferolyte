import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { IsFamilyFilter } from '../../interfaces/filters/is-family-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsFamilyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsFamilyFilter = (
  filter: Partial<IsFamilyFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter({
    ...filter,
    test: 'is_family'
  }, ctx);
};
