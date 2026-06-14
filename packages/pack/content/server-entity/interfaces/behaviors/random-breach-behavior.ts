import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly break surface of the water. This is used by dolphins and turtles.
 */
export interface RandomBreachBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The cooldown time in seconds before the mob can use the goal again.
   * @default 0
   */
  cooldownTime?: number;

  /**
   * A random value to determine at what intervals the mob can breach. This has a 1/interval chance to choose this goal
   * @default 0
   */
  interval?: number;

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
