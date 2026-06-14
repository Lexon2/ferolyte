import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to pick up items on the ground.
 */
export interface PickupItemsBehavior extends BehaviorPriority {
  /**
   * If true, the mob can pickup any item
   * @default false
   */
  canPickupAnyItem?: boolean;

  /**
   * If true, the mob can pickup items to its hand or armor slots
   * @default false
   */
  canPickupToHandOrEquipment?: boolean;

  /**
   * The amount of time an offended entity needs before being willing to pick up items
   * @default 20.0
   */
  cooldownAfterBeingAttacked?: number;

  /**
   * List of items this mob will not pick up
   * @default []
   */
  excludedItems?: string[];

  /**
   * Distance in blocks within the mob considers it has reached the goal. This is the `wiggle room` to stop the AI from bouncing back and forth trying to reach a specific spot
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * Maximum distance this mob will look for items to pick up
   * @default 0.0
   */
  maxDist?: number;

  /**
   * Height in blocks the mob will look for items to pick up
   * @default 0
   */
  searchHeight?: number;

  /**
   * If true, depending on the difficulty, there is a random chance that the mob may not be able to pickup items
   * @default false
   */
  pickupBasedOnChance?: boolean;

  /**
   * If true, the mob will pickup the same item as the item in its hand
   * @default false
   */
  pickupSameItemsAsInHand?: boolean;

  /**
   * If true, this mob will chase after the target as long as it's a valid target
   * @default false
   */
  trackTarget?: boolean;
}