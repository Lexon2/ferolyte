import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly stroll around.
 */
export interface RandomStrollBehavior extends BehaviorPriority {
  /**
   * A random value to determine at what intervals the mob can stroll. This has a 1/interval chance to choose this goal
   * @default 0
   */
  interval?: number;

  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Distance in blocks on ground that the mob will look for a new spot to move to. Must be at least 1
   * @default 10
   */
  xzDist?: number;

  /**
   * Height in blocks the mob will look for a new spot to move to. Must be at least 1
   * @default 7
   */
  yDist?: number;
}
