import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows an entity to take blocks from the world.
 */
export interface TakeBlockBehavior extends BehaviorPriority {
  /**
   * If true, whether the goal is affected by the mob griefing game rule
   */
  affectedByGriefingRule?: boolean;

  /**
   * Block descriptors for which blocks are valid to be taken by the entity, if empty all blocks are valid
   */
  blocks?: string[];

  /**
   * Filters for if the entity should try to take a block. Self and Target are set
   */
  canTake?: EntityFilters;

  /**
   * Chance each tick for the entity to try and take a block
   */
  chance?: number;

  /**
   * Trigger ran if the entity does take a block. Self, Target, and Block are set
   */
  onTake?: EntityEventTrigger;

  /**
   * If true, whether the entity needs line of sight to the block they are trying to take
   */
  requiresLineOfSight?: boolean;

  /**
   * XZ range from which the entity will try and take blocks from
   */
  xzRange?: number | [number, number] | { rangeMin: number; rangeMax: number };

  /**
   * Y range from which the entity will try and take blocks from
   */
  yRange?: number | [number, number] | { rangeMin: number; rangeMax: number };
}
