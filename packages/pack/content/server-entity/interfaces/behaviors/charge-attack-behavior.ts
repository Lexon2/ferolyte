import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this entity to damage a target by using a running attack
 */
export interface ChargeAttackBehavior extends BehaviorPriority {
  /**
   * Speed multiplier for this behavior
   */
  speedMultiplier?: number;

  /**
   * A charge attack cannot start if the entity is farther than this distance to the target
   * @default 3
   */
  maxDistance?: number;

  /**
   * A charge attack cannot start if the entity is closer than this distance to the target
   * @default 2
   */
  minDistance?: number;

  /**
   * Percent chance this entity will start a charge attack, if not already attacking (1.0 = 100%)
   * @default 0.1428
   */
  successRate?: number;
}
