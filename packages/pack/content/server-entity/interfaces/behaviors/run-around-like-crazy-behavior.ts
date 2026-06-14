import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to run around aimlessly.
 */
export interface RunAroundLikeCrazyBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;
}
