import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to move indoors when it's raining.
 */
export interface MoveIndoorsBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving indoors
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The timeout in seconds before the goal can be used again
   * @default 0
   */
  timeout?: number;
}
