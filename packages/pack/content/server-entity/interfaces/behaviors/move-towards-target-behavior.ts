import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mob to move towards its current target.
 */
export interface MoveTowardsTargetBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving towards its target
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Defines the radius in blocks that the mob tries to be from the target
   * @default 0.0
   */
  withinRadius?: number;
}
