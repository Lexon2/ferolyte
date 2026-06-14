import { BehaviorPriority } from './behavior-priority';

/**
 * Allows an entity to charge and use their held item
 */
export interface ChargeHeldItemBehavior extends BehaviorPriority {
  /**
   * The list of items that can be used to charge the held item
   * This list is required and must have at least one item in it
   */
  items?: string[];
}
