/**
 * Interface for the trade_table component
 * Defines this entity's ability to trade with players.
 */
export interface TradeTableComponent {
  /**
   * Determines when the mob transforms, if the trades should be converted when the new mob has a economy_trade_table
   * @default false
   */
  convertTradesEconomy?: boolean;

  /**
   * Name to be displayed while trading with this entity
   */
  displayName?: string;

  /**
   * Used to determine if trading with entity opens the new trade screen
   * @default false
   */
  newScreen?: boolean;

  /**
   * Determines if the trades should persist when the mob transforms
   * @default false
   */
  persistTrades?: boolean;

  /**
   * File path relative to the resource pack root for this entity's trades
   */
  table?: string;
}
