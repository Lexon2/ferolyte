import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this mob to breed with other mobs
 */
export interface BreedBehavior extends BehaviorPriority {
  /**
   * Speed multiplier for this behavior
   */
  speedMultiplier?: number;
}
