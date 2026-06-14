import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * [EXPERIMENTAL BEHAVIOR] The entity will attempt to toss the items from its inventory to a nearby recently played noteblock.
 */
export interface GoAndGiveItemsToNoteblockBehavior extends BehaviorPriority {
  /**
   * Sets the time an entity should continue delivering items to a noteblock after hearing it
   * @default 30
   */
  listenTime?: number;

  /**
   * Event(s) to run when this mob throws items
   */
  onItemThrow?: EntityEventTrigger;

  /**
   * Sets the desired distance to be reached before throwing the items towards the block
   * @default 3.0
   */
  reachBlockDistance?: number;

  /**
   * Sets the entity's speed when running toward the block
   * @default 1.0
   */
  runSpeed?: number;

  /**
   * Sets the throw force
   * @default 0.2
   */
  throwForce?: number;

  /**
   * Sound to play when this mob throws an item
   * @default ""
   */
  throwSound?: string;

  /**
   * Sets the vertical throw multiplier that is applied on top of the throw force in the vertical direction
   * @default 1.5
   */
  verticalThrowMul?: number;
}
