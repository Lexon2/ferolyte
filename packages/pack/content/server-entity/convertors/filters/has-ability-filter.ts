import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { ABILITY_TYPES } from '../../constants/ability-types';
import { HasAbilityFilter } from '../../interfaces/filters/has-ability-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a HasAbilityFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasAbilityFilter = (
  filter: Partial<HasAbilityFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues({
      ...filter,
      test: 'has_ability',
    },
    ABILITY_TYPES, ctx);
};
