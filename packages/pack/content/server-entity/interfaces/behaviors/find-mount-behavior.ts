import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to look around for another mob to ride atop it.
 */
export interface FindMountBehavior extends BehaviorPriority {
  /**
   * If true, the mob will not go into water blocks when going towards a mount
   * @default false
   */
  avoidWater?: boolean;

  /**
   * This is the distance the mob needs to be, in blocks, from the desired mount to mount it
   * If the value is below 0, the mob will use its default attack distance
   * @default -1
   */
  mountDistance?: number;

  /**
   * Time the mob will wait before starting to move towards the mount
   * @default 0
   */
  startDelay?: number;

  /**
   * If true, the mob will only look for a mount if it has a target
   * @default false
   */
  targetNeeded?: boolean;

  /**
   * Distance in blocks within which the mob will look for a mount
   * @default 0
   */
  withinRadius?: number;

  /**
   * The number of failed attempts to make before this goal is no longer used
   */
  maxFailedAttempts?: number;
}
