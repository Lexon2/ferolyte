import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';


/**
 * Allows the mob to offer the player a flower like the Iron Golem does.
 */
export interface OfferFlowerBehavior extends BehaviorPriority {
  /**
   * Percent chance that the mob will start this goal from 0.0 to 1.0 (where 1.0 = 100%)
   * @default 0.0
   */
  chanceToStart?: number;

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
   * The max amount of time (in seconds) that the mob will offer the flower for before exiting the Goal
   * @default 20.0
   */
  maxOfferFlowerDuration?: number;

  /**
   * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target
   * @default 30
   */
  maxRotationX?: number;

  /**
   * The dimensions of the AABB used to search for a potential mob to offer flower to
   * @default [6, 2, 6]
   */
  searchArea?: [number, number, number];
}
