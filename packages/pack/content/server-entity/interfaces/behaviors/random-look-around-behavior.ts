import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly look around.
 */
export interface RandomLookAroundBehavior extends BehaviorPriority {
  /**
   * The angle in degrees that an entity can see in the Y-axis (up-down).
   * @default 360
   */
  angleOfViewHorizontal?: number;

  /**
   * The angle in degrees that an entity can see in the X-axis (left-right).
   * @default 360
   */
  angleOfViewVertical?: number;

  /**
   * The distance in blocks from which the entity will look at.
   * @default 8.0
   */
  lookDistance?: number;

  /**
   * The range of time in seconds the mob will stay looking in a random direction before looking elsewhere.
   * @default [2.0, 2.0]
   */
  lookTime?: [number, number];

  /**
   * The probability of looking around/targeting another player
   * @default 0.02
   */
  probability?: number;
}
