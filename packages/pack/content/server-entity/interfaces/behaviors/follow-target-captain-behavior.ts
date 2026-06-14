import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to follow its target captain.
 */
export interface FollowTargetCaptainBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;

  /**
   * The distance in blocks the mob will stay from its target while following
   */
  followDistance?: number;

  /**
   * The maximum distance in blocks a mob can get from its target captain before giving up trying to follow it
   */
  withinRadius?: number;
}