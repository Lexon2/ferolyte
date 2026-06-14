/**
 * Interface for the economy-trade-table component
 * Defines this entity's ability to trade with players.
 */
export interface EconomyTradeTableComponent {
  /**
   * Determines when the mob transforms, if the trades should be converted when the new mob has a economy_trade_table
   * @default false
   */
  convertTradesEconomy?: boolean;

  /**
   * How much should the discount be modified by when the player has cured the Zombie Villager
   * Can be specified as a pair of numbers (low-tier trade discount and high-tier trade discount)
   * @default [-5, -20]
   */
  curedDiscount?: [number, number];

  /**
   * Name to be displayed while trading with this entity
   * @default ""
   */
  displayName?: string;

  /**
   * Used in legacy prices to determine how much should Demand be modified by when the player has the Hero of the Village mob effect
   * @default -4
   */
  heroDemandDiscount?: number;

  /**
   * The Maximum the discount can be modified by when the player has cured the Zombie Villager
   * Can be specified as a pair of numbers (low-tier trade discount and high-tier trade discount)
   * @default [-25, -63]
   */
  maxCuredDiscount?: [number, number];

  /**
   * The Maximum the discount can be modified by when the player has cured a nearby Zombie Villager
   * @default -200
   */
  maxNearbyCuredDiscount?: number;

  /**
   * How much should the discount be modified by when the player has cured a nearby Zombie Villager
   * @default -25
   */
  nearbyCuredDiscount?: number;

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
   * Show an in game trade screen when interacting with the mob
   * @default true
   */
  showTradeScreen?: boolean;

  /**
   * File path relative to the resource pack root for this entity's trades
   */
  table?: string;

  /**
   * Determines whether the legacy formula is used to determines the trade prices
   * @default false
   */
  useLegacyPriceFormula?: boolean;
}
