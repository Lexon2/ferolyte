import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to follow the player that owns them.
 */
export interface FollowOwnerBehavior extends BehaviorPriority {
  /**
   * Defines how far (in blocks) the entity will be from its owner after teleporting. If not specified, it defaults to "stop_distance" + 1, allowing the entity to seamlessly resume navigation
   */
  postTeleportDistance?: number;

  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;

  /**
   * Specify if the mob can teleport to the player if it is too far away
   * @default true
   */
  canTeleport?: boolean;

  /**
   * Specify if the mob will follow the owner if it has heard a vibration lately
   * @default true
   */
  ignoreVibration?: boolean;

  /**
   * The maximum distance in blocks this mob can be from its owner to start following, only used when canTeleport is false
   * @default 60.0
   */
  maxDistance?: number;

  /**
   * The distance in blocks that the owner can be away from this mob before it starts following it
   * @default 10.0
   */
  startDistance?: number;

  /**
   * The distance in blocks this mob will stop from its owner while following it
   * @default 2.0
   */
  stopDistance?: number;
}
