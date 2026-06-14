import { BehaviorPriority } from './behavior-priority';

/**
 * Allows monsters to jump at and attack their target. Can only be used by hostile mobs.
 */
export interface LeapAtTargetBehavior extends BehaviorPriority {
  /**
   * If true, the mob will only jump at its target if its on the ground
   * @default true
   */
  mustBeOnGround?: boolean;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * The height in blocks the mob jumps when leaping at its target
   * @default 0.0
   */
  yd?: number;

  /**
   * Distance in blocks the mob jumps when leaping at its target
   * @default 0.3
   */
  targetDist?: number;
}
