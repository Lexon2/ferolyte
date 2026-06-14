import { EffectType } from '../../../constants/effect-types';

/**
 * Interface for the mob_effect_immunity component
 * Makes an entity immune to mob effects
 */
export interface MobEffectImmunityComponent {
  /**
   * The effect to make the entity immune to
   */
  effect: EffectType;
}
