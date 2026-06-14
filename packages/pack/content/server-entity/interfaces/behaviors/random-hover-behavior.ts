import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly hover around.
 */
export interface RandomHoverBehavior extends BehaviorPriority {
  /**
   * The height above the surface which the mob will try to maintain.
   * @default [0, 0]
   */
  hoverHeight?: [number, number];

  /**
   * A random value to determine at what intervals the mob can hover. This has a 1/interval chance to choose this goal
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

  /**
   * Height in blocks to add to the selected target position.
   * @default 0
   */
  yOffset?: number;
}
