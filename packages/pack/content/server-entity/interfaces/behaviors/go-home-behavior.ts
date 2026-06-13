import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the mob to move back to the position they were spawned.
 */
export interface GoHomeBehavior extends BehaviorPriority {
  /**
   * Distance in blocks within the mob considers it has reached the goal. This is the `wiggle room` to stop the AI from bouncing back and forth trying to reach a specific spot
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * A random value to determine when to randomly move somewhere. This has a 1/interval chance to choose this goal
   * @default 120
   */
  interval?: number;

  /**
   * Event(s) to run when this mob gets home
   */
  onHome?: EntityEventTrigger[] | EntityEventTrigger;

  /**
   * Event(s) to run when this goal fails
   */
  onFailed?: EntityEventTrigger;

  /**
   * Distance in blocks that the mob is considered close enough to the end of the current path. A new path will then be calculated to continue toward home
   * @default 2.0
   */
  calculateNewPathRadius?: number;

  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;
}
