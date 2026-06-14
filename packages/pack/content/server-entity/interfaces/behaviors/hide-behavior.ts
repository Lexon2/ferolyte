import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob with the hide component to attempt to move to - and hide at - an owned or nearby POI.
 */
export interface HideBehavior extends BehaviorPriority {
  /**
   * Amount of time in seconds that the mob reacts
   * @default 1
   */
  duration?: number;

  /**
   * Defines what POI type to hide at
   * @default ""
   */
  poiType?: string;

  /**
   * The cooldown time in seconds before the goal can be reused after a internal failure or timeout condition
   * @default 8
   */
  timeoutCooldown?: number;

  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;
}
