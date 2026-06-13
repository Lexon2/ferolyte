import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertStringNumberFilter } from './common/convert-string-number';
import { HasMobEffectFilter } from '../../interfaces/filters/has-mob-effect-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a HasMobEffectFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertHasMobEffectFilter = (
  filter: Partial<HasMobEffectFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertStringNumberFilter({
    ...filter,
    test: 'has_mob_effect'
  }, ctx);
};
