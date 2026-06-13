import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { DAMAGE_TYPES } from '../../constants/damage-types';
import { HasDamageFilter } from '../../interfaces/filters/has-damage-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a HasDamageFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasDamageFilter = (
  filter: Partial<HasDamageFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues({
      ...filter,
      test: 'has_damage',
    },
    DAMAGE_TYPES, ctx);
};
