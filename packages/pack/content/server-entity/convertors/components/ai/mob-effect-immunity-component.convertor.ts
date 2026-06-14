import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MobEffectImmunityComponent } from '../../../interfaces/components/ai/mob-effect-immunity-component';
import { validateEffectType } from '../../common/validation';

/**
 * Converts a MobEffectImmunityComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMobEffectImmunityComponent = (
  component: Partial<MobEffectImmunityComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:mob_effect_immunity': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate effect
  if (component.effect !== undefined) {
    if (!validateEffectType(component.effect, 'effect')) {
      return undefined;
    }
    result.effect = component.effect;
  }

  return {
    'minecraft:mob_effect_immunity': result,
  };
};
