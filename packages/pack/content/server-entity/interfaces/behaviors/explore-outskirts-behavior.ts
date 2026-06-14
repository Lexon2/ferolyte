import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the entity to first travel to a random point on the outskirts of the village, and then explore random points within a small distance.
 * This goal requires "minecraft:dweller" and "minecraft:navigation" to execute.
 */
export interface ExploreOutskirtsBehavior extends BehaviorPriority {
  /**
   * The speed multiplier
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The distance from the boundary the villager must be within in to explore the outskirts
   * @default [5, 0, 5]
   */
  distFromBoundary?: [number, number, number];

  /**
   * Total distance in blocks the the entity will explore beyond the village bounds when choosing its travel point
   * @default 5.0
   */
  exploreDist?: number;

  /**
   * This is the maximum amount of time an entity will attempt to reach it's travel point on the outskirts of the village before the goal exits
   * @default 60.0
   */
  maxTravelTime?: number;

  /**
   * The wait time in seconds between choosing new explore points will be chosen on a random interval between this value and the minimum wait time
   * This value is also the total amount of time the entity will explore random points before the goal stops
   * @default 0.0
   */
  maxWaitTime?: number;

  /**
   * The entity must be within this distance for it to consider it has successfully reached its target
   * @default 2.2
   */
  minDistFromTarget?: number;

  /**
   * The minimum perimeter of the village required to run this goal
   * @default 1.0
   */
  minPerimeter?: number;

  /**
   * The wait time in seconds between choosing new explore points will be chosen on a random interval between this value and the maximum wait time
   * @default 3.0
   */
  minWaitTime?: number;

  /**
   * A new explore point will randomly be chosen within this XZ distance of the current target position when navigation has finished and the wait timer has elapsed
   * @default 5
   */
  nextXz?: number;

  /**
   * A new explore point will randomly be chosen within this Y distance of the current target position when navigation has finished and the wait timer has elapsed
   * @default 3
   */
  nextY?: number;

  /**
   * Each new explore point will be chosen on a random interval between the minimum and the maximum wait time, divided by this value
   * This does not apply to the first explore point chosen when the goal runs
   * @default 2.0
   */
  timerRatio?: number;
}
