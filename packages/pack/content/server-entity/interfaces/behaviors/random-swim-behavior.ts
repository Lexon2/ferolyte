import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly swim around.
 */
export interface RandomSwimBehavior extends BehaviorPriority {
  /**
   * If true, the mob will avoid surface water blocks by swimming below them.
   * @default true
   */
  avoidSurface?: boolean;

  /**
   * A random value to determine at what intervals the mob can swim. This has a 1/interval chance to choose this goal
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
