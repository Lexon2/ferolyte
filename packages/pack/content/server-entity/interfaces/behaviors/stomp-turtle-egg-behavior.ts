import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to stomp turtle eggs.
 */
export interface StompTurtleEggBehavior extends BehaviorPriority {
  /**
   * The radius of the goal.
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * A random value to determine when to randomly move somewhere. This has a 1/interval chance to choose this goal
   * @default 120
   */
  interval?: number;

  /**
   * The number of blocks each tick that the mob will check within it's search range and height for a valid block to move to. A value of 0 will have the mob check every block within range in one tick
   * @default 10
   */
  searchCount?: number;

  /**
   * Height in blocks the mob will look for turtle eggs to move towards.
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks it will look for turtle eggs to move towards.
   * @default 0
   */
  searchRange?: number;
}
