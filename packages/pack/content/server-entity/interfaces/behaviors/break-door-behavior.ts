import { BehaviorPriority } from "./behavior-priority";

/**
 * Allows this mob to break doors
 */
export interface BreakDoorBehavior extends BehaviorPriority {
  /**
   * Speed multiplier for this behavior
   */
  speedMultiplier?: number;
}
