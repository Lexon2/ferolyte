import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Can only be used by Villagers. Allows the mob to accept flowers from Iron Golems.
 */
export interface TakeFlowerBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * Conditions that need to be met for the behavior to start
   */
  filters?: EntityFilters;

  /**
   * Maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target
   * @default 30
   */
  maxHeadRotationY?: number;

  /**
   * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target
   * @default 30
   */
  maxRotationX?: number;

  /**
   * The maximum amount of time (in seconds) for the mob to randomly wait for before taking the flower
   * @default 20.0
   */
  maxWaitTime?: number;

  /**
   * Minimum distance (in blocks) for the entity to be considered having reached its target
   * @default 2.0
   */
  minDistanceToTarget?: number;

  /**
   * The minimum amount of time (in seconds) for the mob to randomly wait for before taking the flower
   * @default 4.0
   */
  minWaitTime?: number;

  /**
   * The dimensions of the AABB used to search for a potential mob to take a flower from
   * @default [6, 2, 6]
   */
  searchArea?: [number, number, number];
}
