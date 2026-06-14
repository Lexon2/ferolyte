import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to float around like the Ghast.
 */
export interface FloatWanderBehavior extends BehaviorPriority {
  /**
   * If true, the mob will have an additional buffer zone around it to avoid collisions with blocks when picking a position to wander to
   * @default false
   */
  additionalCollisionBuffer?: boolean;

  /**
   * If true allows the mob to navigate through liquids on its way to the target position
   * @default false
   */
  allowNavigatingThroughLiquids?: boolean;

  /**
   * Distance in blocks on ground that the mob will look for a new spot to move to. Must be at least 1
   * @default 10
   */
  xzDist?: number;

  /**
   * Distance in blocks that the mob will look up or down for a new spot to move to. Must be at least 1
   * @default 7
   */
  yDist?: number;

  /**
   * Height in blocks to add to the selected target position
   * @default 0.0
   */
  yOffset?: number;

  /**
   * If true, the point has to be reachable to be a valid target
   * @default false
   */
  mustReach?: boolean;

  /**
   * If true, the MoveControl flag will be added to the behavior which means that it can no longer be active at the same time as other behaviors with MoveControl
   * @default true
   */
  floatWanderHasMoveControl?: boolean;

  /**
   * If true, will prioritize finding random positions in the vicinity of surfaces, i.e. blocks that are not Air or Liquid
   * @default false
   */
  navigateAroundSurface?: boolean;

  /**
   * If true, the mob will randomly pick a new point while moving to the previously selected one
   * @default false
   */
  randomReselect?: boolean;

  /**
   * The horizontal distance in blocks that the goal will check for a surface from a candidate position. Only valid when `navigateAroundSurface` is true
   * @default 0
   */
  surfaceXzDist?: number;

  /**
   * The vertical distance in blocks that the goal will check for a surface from a candidate position. Only valid when `navigateAroundSurface` is true
   * @default 0
   */
  surfaceYDist?: number;

  /**
   * If true, the mob will respect home position restrictions when choosing new target positions. If false, it will choose target position without considering home restrictions
   * @default false
   */
  useHomePositionRestriction?: boolean;

  /**
   * Range of time in seconds the mob will float around before landing and choosing to do something else
   * @default [0.0, 0.0]
   */
  floatDuration?: [number, number];
}
