import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { IsSkinIdFilter } from "../../interfaces/filters/is-skin-id-filter";
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsSkinIdFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsSkinIdFilter = (
  filter: Partial<IsSkinIdFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter({
    ...filter,
    test: 'is_skin_id'
  }, ctx);
};
