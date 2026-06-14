import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to follow their parent around.
 */
export interface FollowParentBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;
}
