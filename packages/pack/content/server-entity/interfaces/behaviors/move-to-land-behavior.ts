import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to move back onto land when in water.
 */
export interface MoveToLandBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to land
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
   * Height in blocks the mob will look for land to move towards
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks it will look for land to move towards
   * @default 0
   */
  searchRange?: number;
}
