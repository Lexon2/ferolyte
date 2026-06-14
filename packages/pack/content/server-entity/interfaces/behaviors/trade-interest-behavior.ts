import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to look at a player that is holding a tradable item.
 */
export interface TradeInterestBehavior extends BehaviorPriority {
  /**
   * The Maximum time in seconds that the trader will hold an item before attempting to switch for a different item that takes the same trade.
   * @default 2
   */
  carriedItemSwitchTime?: number;

  /**
   * The time in seconds before the trader can use this goal again.
   * @default 2
   */
  cooldown?: number;

  /**
   * The Maximum time in seconds that the trader will be interested with showing it's trade items.
   * @default 45
   */
  interestTime?: number;

  /**
   * The Maximum time in seconds that the trader will wait when you no longer have items to trade.
   * @default 1
   */
  removeItemTime?: number;

  /**
   * Distance in blocks this mob can be interested by a player holding an item they like.
   * @default 0
   */
  withinRadius?: number;
}
