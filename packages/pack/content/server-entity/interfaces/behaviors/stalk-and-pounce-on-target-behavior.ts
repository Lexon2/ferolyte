import { EntityFilters } from '../filters';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows an entity to stalk a specific target. Once within range of the target, the entity will then leap at the target and deal damage based upon its attack attribute.
 */
export interface StalkAndPounceOnTargetBehavior extends BehaviorPriority {
  /**
   * The amount of time the mob will be interested before pouncing. This happens when the mob is within range of pouncing
   * @default 2
   */
  interestTime?: number;

  /**
   * The distance in blocks the mob jumps in the direction of its target
   * @default 0.8
   */
  leapDistance?: number;

  /**
   * The height in blocks the mob jumps when leaping at its target
   * @default 0.9
   */
  leapHeight?: number;

  /**
   * The maximum distance away a target can be before the mob gives up on stalking
   * @default 10
   */
  maxStalkDist?: number;

  /**
   * The maximum distance away from the target in blocks to begin pouncing at the target
   * @default 5
   */
  pounceMaxDist?: number;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * The movement speed in which you stalk your target
   * @default 1.2
   */
  stalkSpeed?: number;

  /**
   * The Maximum distance away from the target when landing from the pounce that will still result in damaging the target
   * @default 2
   */
  strikeDist?: number;

  /**
   * The amount of time the mob will be stuck if they fail and land on a block they can be stuck on
   * @default 2
   */
  stuckTime?: number;

  /**
   * The distance in blocks the mob jumps in the direction of their target
   */
  leapDist?: number;

  /**
   * Filters to apply on the block the mob lands on to determine if it is valid for getting stuck
   */
  stuckBlocks?: EntityFilters;
}
