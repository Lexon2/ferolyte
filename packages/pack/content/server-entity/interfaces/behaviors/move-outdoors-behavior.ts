import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to move outdoors when it's not raining.
 */
export interface MoveOutdoorsBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving outdoors
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The timeout in seconds before the goal can be used again
   * @default 0
   */
  timeout?: number;

  /**
   * The radius away from the target block to count as reaching the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The amount of times to try finding a random outdoors position before failing
   * @default 10
   */
  searchCount?: number;

  /**
   * The y range to search for an outdoors position for
   * @default 5
   */
  searchHeight?: number;

  /**
   * The x and z range to search for an outdoors position for
   * @default 15
   */
  searchRange?: number;
}
