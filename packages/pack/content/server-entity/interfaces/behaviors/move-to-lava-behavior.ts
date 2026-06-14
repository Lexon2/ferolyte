import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to move to lava.
 */
export interface MoveToLavaBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to lava
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The number of blocks each tick that the mob will check within its search range and height for a valid block to move to
   * @default 10
   */
  searchCount?: number;

  /**
   * Height in blocks the mob will look for lava to move towards
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks it will look for lava to move towards
   * @default 0
   */
  searchRange?: number;
}
