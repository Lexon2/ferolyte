import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows a mob to move to a specific block.
 */
export interface MoveToBlockBehavior extends BehaviorPriority {
  /**
   * The radius away from the target block to count as reaching the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The event to trigger when the mob stays at the target block
   */
  onStayCompleted?: EntityEventTrigger;

  /**
   * The event to trigger when the mob reaches the target block
   */
  onReach?: EntityEventTrigger;

  /**
   * The chance to start the behavior
   * @default 1.0
   */
  startChance?: number;

  /**
   * The distance in blocks that the mob will look for the block
   * @default 0
   */
  searchRange?: number;

  /**
   * The height in blocks that the mob will look for the block
   * @default 1
   */
  searchHeight?: number;

  /**
   * The number of ticks needed to complete a stay at the block
   * @default 0
   */
  stayDuration?: number;

  /**
   * The method to use to select the target block
   * @default "nearest"
   */
  targetSelectionMethod?: 'nearest' | 'random';

  /**
   * The offset to add to the selected target position
   * @default [0, 0, 0]
   */
  targetOffset?: [number, number, number];

  /**
   * The blocks that the mob will move to
   */
  targetBlocks?: string[];

  /**
   * The filters to apply to the target blocks
   */
  targetBlockFilters?: EntityFilters;

  /**
   * The interval in ticks to try to run this behavior
   * @default 20
   */
  tickInterval?: number;
}
