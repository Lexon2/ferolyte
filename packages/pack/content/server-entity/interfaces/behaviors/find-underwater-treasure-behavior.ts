import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to move towards the nearest underwater ruin or shipwreck.
 */
export interface FindUnderwaterTreasureBehavior extends BehaviorPriority {
  /**
   * The speed multiplier
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The range that the mob will search for a treasure chest within a ruin or shipwreck to move towards
   * @default 0
   */
  searchRange?: number;

  /**
   * The distance the mob will move before stopping
   * @default 2.0
   */
  stopDistance?: number;
}
