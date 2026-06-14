import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mobs that own a bed to in a village to move to and sleep in it.
 */
export interface SleepBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * If true, the mob will be able to use the sleep goal if riding something
   * @default false
   */
  canSleepWhileRiding?: boolean;

  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0.0
   */
  cooldownTime?: number;

  /**
   * The height of the mob's collider while sleeping
   * @default 1.0
   */
  sleepColliderHeight?: number;

  /**
   * The width of the mob's collider while sleeping
   * @default 1.0
   */
  sleepColliderWidth?: number;

  /**
   * The y offset of the mob's collider while sleeping
   * @default 1.0
   */
  sleepYOffset?: number;

  /**
   * The cooldown time in seconds before the goal can be reused after a internal failure or timeout condition
   * @default 8.0
   */
  timeoutCooldown?: number;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;
}
