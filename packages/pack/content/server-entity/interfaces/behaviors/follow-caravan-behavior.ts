import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to follow mobs that are in a caravan.
 */
export interface FollowCaravanBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;

  /**
   * List of entity types that this mob can follow in a caravan
   */
  entityTypes?: EntityTypes;

  /**
   * Number of entities that can be in the caravan
   * @default 1
   */
  entityCount?: number;
}
