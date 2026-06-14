import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the entity go idle, if swimming. Entity must be in water.
 */
export interface SwimIdleBehavior extends BehaviorPriority {
  /**
   * Amount of time (in seconds) to stay idle
   * @default 5
   */
  idleTime?: number;

  /**
   * Percent chance this entity will go idle, 1.0 = 100%
   * @default 0.1
   */
  successRate?: number;
}
