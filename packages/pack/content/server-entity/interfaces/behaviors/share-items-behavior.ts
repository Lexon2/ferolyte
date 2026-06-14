import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to give items it has to others.
 */
export interface ShareItemsBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * List of entities this mob will share items with
   */
  entityTypes?: EntityTypes;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * Maximum distance in blocks this mob will look for entities to share items with
   * @default 0
   */
  maxDist?: number;
}
