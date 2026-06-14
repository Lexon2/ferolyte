import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the entity to consume a block, replace the eaten block with another block, and trigger an event as a result.
 */
export interface EatBlockBehavior extends BehaviorPriority {
  /**
   * The event to trigger when the block eating animation has completed
   */
  onEat?: EntityEventTrigger;

  /**
   * A molang expression defining the success chance the entity has to consume a block
   * @default 0.02
   */
  successChance?: number;

  /**
   * The amount of time (in seconds) it takes for the block to be eaten upon a successful eat attempt
   * @default 1.8
   */
  timeUntilEat?: number;

  /**
   * A collection of pairs of blocks; the first ("eat_block") is the block the entity should eat,
   * the second ("replace_block") is the block that should replace the eaten block
   */
  eatAndReplaceBlockPairs?: {
    /**
     * The block to eat
     */
    eatBlock: string;

    /**
     * The block to replace the eaten block with
     */
    replaceBlock: string;
  }[];
}
