import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to look at the player they are trading with.
 */
export interface LookAtTradingPlayerBehavior extends BehaviorPriority {
  /**
   * The distance in blocks from which the entity will look at the player this mob is trading with
   * @default 8.0
   */
  lookDistance?: number;

  /**
   * The probability of looking at the target. A value of 1.00 is 100%
   * @default 0.02
   */
  probability?: number;

  /**
   * Time range to look at the player this mob is trading with
   * @default [2, 4]
   */
  lookTime?: [number, number];

  /**
   * The angle in degrees that the mob can see in the X-axis (left-right)
   * @default 360
   */
  angleOfViewVertical?: number;

  /**
   * The angle in degrees that the mob can see in the Y-axis (up-down)
   * @default 360
   */
  angleOfViewHorizontal?: number;
}
