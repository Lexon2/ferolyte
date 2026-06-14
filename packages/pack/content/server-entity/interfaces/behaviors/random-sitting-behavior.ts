import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly sit for a duration.
 */
export interface RandomSittingBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldown?: number;

  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * The minimum amount of time in seconds before the mob can stand back up
   * @default 10
   */
  minSitTime?: number;

  /**
   * This is the chance that the mob will start this goal, from 0 to 1
   * @default 0.1
   */
  startChance?: number;

  /**
   * This is the chance that the mob will stop this goal, from 0 to 1
   * @default 0.3
   */
  stopChance?: number;
}
