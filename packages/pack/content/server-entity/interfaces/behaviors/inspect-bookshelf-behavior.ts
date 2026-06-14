import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to inspect bookshelves.
 */
export interface InspectBookshelfBehavior extends BehaviorPriority {
  /**
   * Distance in blocks within the mob considers it has reached the goal. This is the `wiggle room` to stop the AI from bouncing back and forth trying to reach a specific spot
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The number of blocks each tick that the mob will check within it's search range and height for a valid block to move to. A value of 0 will have the mob check every block within range in one tick
   * @default 10
   */
  searchCount?: number;

  /**
   * The height that the mob will search for bookshelves
   * @default 1
   */
  searchHeight?: number;

  /**
   * Distance in blocks the mob will look for books to inspect
   * @default 0
   */
  searchRange?: number;

  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;
}
