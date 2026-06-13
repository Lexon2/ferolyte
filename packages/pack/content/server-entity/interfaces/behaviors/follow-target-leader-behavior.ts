import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows mob to move towards its current target leader.
 */
export interface FollowTargetLeaderBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * If true, the mob will always search for a valid leader to follow if none is found or current leader is not valid anymore
   * @default false
   */
  alwaysLookForLeader?: boolean;

  /**
   * Defines the distance in blocks the mob will stay from its target while following
   * @default 0
   */
  followDistance?: number;

  /**
   * The filters to use when determining if a mob is a suitable leader or not
   */
  leaderFilters?: EntityFilters;

  /**
   * Number of ticks that must pass before a new search is initiated after a target is not found, lost, or becomes invalid
   * @default 20
   */
  searchCooldown?: number;

  /**
   * Defines the maximum distance in blocks a mob can get from its target captain before giving up trying to follow it
   * @default 0
   */
  withinRadius?: number;
}
