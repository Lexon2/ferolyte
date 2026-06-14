import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this entity to fly around looking for a player to shoot fireballs at. Note: This behavior can only be used by the ender_dragon entity type.
 */
export interface DragonStrafePlayerBehavior extends BehaviorPriority {
  /**
   * The speed this entity moves when this behavior has started or while it's active
   * @default 3
   */
  activeSpeed?: number;

  /**
   * Maximum distance of this entity's fireball attack while strafing
   * @default 64
   */
  fireballRange?: number;

  /**
   * The speed this entity moves while this behavior is not active
   * @default 0.6
   */
  flightSpeed?: number;

  /**
   * Percent chance to to switch this entity's strafe direction between clockwise and counterclockwise
   * Switch direction chance occurs each time a new target is chosen (1.0 = 100%)
   * @default 0.125
   */
  switchDirectionProbability?: number;

  /**
   * Time (in seconds) the target must be in fireball range, and in view [ie, no solid terrain in-between the target and this entity], before a fireball can be shot
   * @default 0.25
   */
  targetInRangeAndInViewTime?: number;

  /**
   * Minimum and maximum distance, from the target, this entity can use this behavior
   * @default [10, 150]
   */
  targetZone?: [number, number];

  /**
   * The speed at which this entity turns while using this behavior
   * @default 0.7
   */
  turnSpeed?: number;

  /**
   * The target must be within "view_angle" degrees of the dragon's current rotation before a fireball can be shot
   * @default 10
   */
  viewAngle?: number;
}
