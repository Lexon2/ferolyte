import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows an entity to place blocks in the world.
 */
export interface PlaceBlockBehavior extends BehaviorPriority {
  /**
   * If true, whether the goal is affected by the mob griefing game rule
   */
  affectedByGriefingRule?: boolean;

  /**
   * Filters for if the entity should try to place its block. Self and Target are set
   */
  canPlace?: EntityFilters;

  /**
   * Chance each tick for the entity to try and place a block
   */
  chance?: number;

  /**
   * Trigger ran if the entity does place its block. Self, Target, and Block are set
   */
  onPlace?: EntityEventTrigger;

  /**
   * Block descriptors for which blocks are valid to be placed from the entity's carried item, if empty all blocks are valid
   */
  placeableCarriedBlocks?: string[];

  /**
   * Weighted block descriptors for which blocks should be randomly placed, if empty the entity will try to place its carried block from placeable_carried_blocks
   */
  randomlyPlaceableBlocks?: [string, number][];

  /**
   * XZ range from which the entity will try and place blocks in
   */
  xzRange?: number | [number, number] | { rangeMin: number; rangeMax: number };

  /**
   * Y range from which the entity will try and place blocks in
   */
  yRange?: number | [number, number] | { rangeMin: number; rangeMax: number };
}
