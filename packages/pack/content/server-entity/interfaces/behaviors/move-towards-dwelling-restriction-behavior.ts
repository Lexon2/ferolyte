import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mobs with the dweller component to move toward their Village area that the mob should be restricted to.
 */
export interface MoveTowardsDwellingRestrictionBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving towards its dwelling restriction
   * @default 1.0
   */
  speedMultiplier?: number;
}
