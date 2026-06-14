import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to pathfind while mounted on another mob.
 */
export interface MountPathingBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while pathing
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * If true, this mob will chase after the target as long as it's a valid target
   * @default false
   */
  trackTarget?: boolean;

  /**
   * The distance at which this mob wants to be away from its target
   * @default 0
   */
  targetDistance?: number;
}
