import { BehaviorPriority } from './behavior-priority';

/**
 * If the mob is carrying a food item, the mob will eat it and the effects will be applied to the mob.
 */
export interface EatCarriedItemBehavior extends BehaviorPriority {
  /**
   * Time in seconds the mob should wait before eating the item
   */
  delayBeforeEating?: number;
}
