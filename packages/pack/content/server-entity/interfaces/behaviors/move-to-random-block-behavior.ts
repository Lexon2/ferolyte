import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mob to move towards a random block.
 */
export interface MoveToRandomBlockBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to the random block
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Defines the distance from the mob, in blocks, that the block to move to will be chosen
   * @default 16
   */
  blockDistance?: number;

  /**
   * Defines the distance in blocks the mob has to be from the block for the movement to be finished
   * @default 0
   */
  withinRadius?: number;
}
