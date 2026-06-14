import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to search within an area for a growable crop block. If found, the mob will use any available fertilizer in their inventory on the crop.
 * This goal will not execute if the mob does not have a fertilizer item in its inventory.
 */
export interface FertilizeFarmBlockBehavior extends BehaviorPriority {
  /**
   * The speed multiplier
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Distance in blocks within the mob considers it has reached it's target position
   * @default 1.5
   */
  goalRadius?: number;

  /**
   * The maximum number of times the mob will use fertilzer on the target block
   * @default 1
   */
  maxFertilizerUsage?: number;

  /**
   * The maximum amount of time in seconds that the goal can take before searching again
   * The time is chosen between 0 and this number
   * @default 8.0
   */
  searchCooldownMaxSeconds?: number;

  /**
   * The number of randomly selected blocks each tick that the mob will check within its search range and height for a valid block to move to
   * A value of 0 will have the mob check every block within range in one tick
   * @default 9
   */
  searchCount?: number;

  /**
   * The Height in blocks the mob will search within to find a valid target position
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks the mob will search within to find a valid target position
   * @default 1
   */
  searchRange?: number;
}
