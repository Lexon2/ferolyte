import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to move into a random location within a village.
 */
export interface MoveToVillageBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to the village
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The distance in blocks to search for villages
   * @default 0
   */
  searchRange?: number;
}
