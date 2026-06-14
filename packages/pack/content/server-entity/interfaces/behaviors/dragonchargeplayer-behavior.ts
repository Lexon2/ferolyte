import { BehaviorPriority } from './behavior-priority';

/**
 * Interface for the DragonChargePlayerBehavior
 * Allows an entity to charge at a player
 */
export interface DragonChargePlayerBehavior extends BehaviorPriority {
  /**
   * The speed this entity moves when this behavior has started or while it's active
   */
  activeSpeed?: number;

  /**
   * If the dragon is outside the "target_zone" for longer than "continue_charge_threshold_time" seconds, the charge is canceled
   */
  continueChargeThresholdTime?: number;

  /**
   * The speed this entity moves while this behavior is not active
   */
  flightSpeed?: number;

  /**
   * The minimum and maximum distance from the target, this entity can use this behavior
   */
  targetZone?: [number, number];

  /**
   * The speed at which this entity turns while using this behavior
   */
  turnSpeed?: number;
}
