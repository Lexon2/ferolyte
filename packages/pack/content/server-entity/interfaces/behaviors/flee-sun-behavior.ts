import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to run away from direct sunlight and seek shade.
 */
export interface FleeSunBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;
}
