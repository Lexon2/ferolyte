import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';


/**
 * Allows the entity follow another entity. Both entities must be swimming and in water.
 */
export interface SwimWithEntityBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * Percent chance to start following another entity, if not already doing so. 1.0 = 100%
   * @default 0.1
   */
  successRate?: number;

  /**
   * Percent chance to stop following the current entity, if they're riding another entity or they're not swimming. 1.0 = 100%
   * @default 0.0333
   */
  chanceToStop?: number;

  /**
   * Time (in seconds) between checks to determine if this entity should catch up to the entity being followed or match the direction of the entity being followed
   * @default 0.5
   */
  stateCheckInterval?: number;

  /**
   * Distance, from the entity being followed, at which this entity will speed up to reach that entity
   * @default 12
   */
  catchUpThreshold?: number;

  /**
   * Distance, from the entity being followed, at which this entity will try to match that entity's direction
   * @default 2
   */
  matchDirectionThreshold?: number;

  /**
   * The multiplier this entity's speed is modified by when matching another entity's direction
   * @default 2.5
   */
  catchUpMultiplier?: number;

  /**
   * Radius around this entity to search for another entity to follow
   * @default 20
   */
  searchRange?: number;

  /**
   * Distance, from the entity being followed, at which this entity will stop following that entity
   * @default 5
   */
  stopDistance?: number;

  /**
   * Filters which determine what entites are valid to follow
   */
  entityTypes?: EntityTypes;
}
