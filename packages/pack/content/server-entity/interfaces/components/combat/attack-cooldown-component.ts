import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the attack_cooldown component
 * Adds a cooldown to a mob. The intention of this cooldown is to be used to prevent the mob from attempting to aquire new attack targets.
 */
export interface AttackCooldownComponent {
  /**
   * Event to be run when the cooldown is complete
   */
  attackCooldownCompleteEvent?: EntityEventTrigger;

  /**
   * Amount of time in seconds for the cooldown. Can be specified as a number or a pair of numbers (Minimum and max)
   * @default [0.0, 1.0]
   */
  attackCooldownTime?: number | [number, number];
}
