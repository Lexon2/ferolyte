import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mobs with the home component to move toward their pre-defined area that the mob should be restricted to.
 */
export interface MoveTowardsHomeRestrictionBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving towards its home restriction
   * @default 1.0
   */
  speedMultiplier?: number;
}
