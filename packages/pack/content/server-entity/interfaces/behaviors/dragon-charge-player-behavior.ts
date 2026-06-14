import { BehaviorPriority } from './behavior-priority';

/**
 * Interface for the DragonDeathBehavior
 * Allows an entity to die
 */
export interface DragonChargePlayerBehavior extends BehaviorPriority {
  /**
   * The speed this entity moves when this behavior has started or while it's active
   * @default 3
   */
  activeSpeed?: number;

  /**
   * If the dragon is outside the "targetZone" for longer than "continueChargeThresholdTime" seconds, the charge is canceled
   * @default 0.5
   */
  continueChargeThresholdTime?: number;

  /**
   * The speed this entity moves while this behavior is not active
   * @default 0.6
   */
  flightSpeed?: number;

  /**
   * The minimum and maximum distance, from the target, this entity can use this behavior
   * @default [10, 150]
   */
  targetZone?: [number, number];

  /**
   * The speed this entity rotates while this behavior is active
   * @default 0.7
   */
  turnSpeed?: number;
}
