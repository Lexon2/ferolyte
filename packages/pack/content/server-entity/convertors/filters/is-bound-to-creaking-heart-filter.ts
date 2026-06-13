import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { IsBoundToCreakingHeartFilter } from '../../interfaces/filters/is-bound-to-creaking-heart-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsBoundToCreakingHeartFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsBoundToCreakingHeartFilter = (
  filter: Partial<IsBoundToCreakingHeartFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter({
    ...filter,
    test: 'is_bound_to_creaking_heart'
  }, ctx);
};
