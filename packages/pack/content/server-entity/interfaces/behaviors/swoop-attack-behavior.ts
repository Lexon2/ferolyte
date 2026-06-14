import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to move to attack a target. The goal ends if it has a horizontal collision or gets hit. Built to be used with flying mobs.
 */
export interface SwoopAttackBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * Added to the base size of the entity, to determine the target's maximum allowable distance, when trying to deal attack damage
   * @default 0.2
   */
  damageReach?: number;

  /**
   * Minimum and maximum cooldown time-range (in seconds) between each attempted swoop attack
   * @default [10.0, 20.0]
   */
  delayRange?: [number, number];
}
