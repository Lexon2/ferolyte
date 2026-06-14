import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the pet to sleep with its owner while the owner is sleeping.
 */
export interface PetSleepWithOwnerBehavior extends BehaviorPriority {
  /**
   * The speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The radius that the mob will search for an owner to curl up with.
   * @default 10
   */
  searchRadius?: number;

  /**
   * The radius away from the owner to count as reaching the goal
   * @default 0.5
  */
 goalRadius?: number;

 /**
  * The height in blocks from the owner the pet can be to sleep with owner.
  * @default 1
  */
 searchHeight?: number;

  /**
   * The range that the mob will search for an owner to curl up with.
   * @default 10
   */
  searchRange?: number;

}
