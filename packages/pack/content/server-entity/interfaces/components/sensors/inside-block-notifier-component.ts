import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for a single block entry in the inside_block_notifier component
 * Defines a block and its associated events
 */
export interface BlockNotifierEntry {
  /**
   * Block definition
   */
  block: string;

  /**
   * Event to run when this mob enters a valid block
   */
  enteredBlockEvent?: EntityEventTrigger;

  /**
   * Event to run when this mob leaves a valid block
   */
  exitedBlockEvent?: EntityEventTrigger;
}

/**
 * Interface for the inside_block_notifier component
 * Verifies whether the entity is inside any of the listed blocks
 */
export interface InsideBlockNotifierComponent {
  /**
   * List of blocks, with certain block states, that we are monitoring to see if the entity is inside
   */
  blockList?: BlockNotifierEntry[];
}
