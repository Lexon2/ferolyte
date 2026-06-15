import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SpellEffectsComponent } from '../../../interfaces/components/miscellaneous/spell-effects-component';
import { validateBoolean, validateInteger } from '../../common/validation';

/**
 * Converts a SpellEffectsComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSpellEffectsComponent = (
  component: Partial<SpellEffectsComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:spell_effects': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate addEffects
  if (component.addEffects !== undefined) {
    if (!Array.isArray(component.addEffects)) {
      console.error('addEffects must be an array');

      return undefined;
    }

    result.add_effects = component.addEffects.map((effect, index) => {
      const effectResult: any = {};

      // Validate amplifier
      if (effect.amplifier !== undefined) {
        if (
          !validateInteger(effect.amplifier, `addEffects[${index}].amplifier`)
        ) {
          return undefined;
        }
        effectResult.amplifier = effect.amplifier;
      }

      // Validate ambient
      if (effect.ambient !== undefined) {
        if (!validateBoolean(effect.ambient, `addEffects[${index}].ambient`)) {
          return undefined;
        }
        effectResult.ambient = effect.ambient;
      }

      // Validate duration
      if (effect.duration !== undefined) {
        if (
          effect.duration !== 'infinite' &&
          (typeof effect.duration !== 'number' || effect.duration < 0)
        ) {
          console.error(
            `addEffects[${index}].duration must be a non-negative number or 'infinite'`,
          );

          return undefined;
        }
        effectResult.duration = effect.duration;
      }

      // Validate displayOnScreenAnimation
      if (effect.displayOnScreenAnimation !== undefined) {
        if (
          !validateBoolean(
            effect.displayOnScreenAnimation,
            `addEffects[${index}].displayOnScreenAnimation`,
          )
        ) {
          return undefined;
        }
        effectResult.display_on_screen_animation =
          effect.displayOnScreenAnimation;
      }

      // Validate effect
      if (typeof effect.effect !== 'string') {
        console.error(`addEffects[${index}].effect must be a string`);

        return undefined;
      }
      effectResult.effect = effect.effect;

      // Validate visible
      if (effect.visible !== undefined) {
        if (!validateBoolean(effect.visible, `addEffects[${index}].visible`)) {
          return undefined;
        }
        effectResult.visible = effect.visible;
      }

      return effectResult;
    });

    if (result.add_effects.includes(undefined)) {
      return undefined;
    }
  }

  // Validate removeEffects
  if (component.removeEffects !== undefined) {
    if (typeof component.removeEffects === 'string') {
      result.remove_effects = component.removeEffects;
    } else if (Array.isArray(component.removeEffects)) {
      if (
        !component.removeEffects.every((effect) => typeof effect === 'string')
      ) {
        console.error('removeEffects must be a string or an array of strings');

        return undefined;
      }
      result.remove_effects = component.removeEffects;
    } else {
      console.error('removeEffects must be a string or an array of strings');

      return undefined;
    }
  }

  return {
    'minecraft:spell_effects': result,
  };
};
