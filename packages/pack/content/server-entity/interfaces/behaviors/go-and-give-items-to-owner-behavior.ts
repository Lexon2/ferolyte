import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * [EXPERIMENTAL BEHAVIOR] The entity will attempt to toss the items from its inventory to its owner.
 */
export interface GoAndGiveItemsToOwnerBehavior extends BehaviorPriority {
  /**
   * Event(s) to run when this mob throws items
   */
  onItemThrow?: EntityEventTrigger;

  /**
   * Sets the desired distance to be reached before giving items to owner
   * @default 3.0
   */
  reachMobDistance?: number;

  /**
   * Sets the entity's speed when running toward the owner
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
   * @default "item_thrown"
   */
  throwSound?: string;

  /**
   * Sets the vertical throw multiplier that is applied on top of the throw force in the vertical direction
   * @default 1.5
   */
  verticalThrowMul?: number;
}
