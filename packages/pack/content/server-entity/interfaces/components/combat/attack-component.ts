
import { EffectType } from '../../../constants/effect-types';

/**
 * Interface for the attack component
 * Defines an entity's melee attack and any additional effects on it.
 */
export interface AttackComponent {
  /**
   * Range of the random amount of damage the melee attack deals
   * A negative value can heal the entity instead of hurting it
   */
  damage: number | [number, number];

  /**
   * Identifier of the status ailment to apply to an entity attacked by this entity's melee attack
   */
  effectName?: EffectType;

  /**
   * Duration in seconds of the status ailment applied to the damaged entity
   * @default 1
   */
  effectDuration?: number | 'infinite';
}
