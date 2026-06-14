import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to move through a village.
 */
export interface MoveThroughVillageBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving through the village
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * If true, the mob will only move through the village during night time
   * @default false
   */
  onlyAtNight?: boolean;
}
