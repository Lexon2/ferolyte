/**
 * Interface for the barter component
 * Enables the component to drop an item as a barter exchange.
 */
export interface BarterComponent {
  /**
   * Loot table that's used to drop a random item
   */
  barterTable: string;

  /**
   * Duration, in seconds, for which mob won't barter items if it was hurt
   * @default 0
   */
  cooldownAfterBeingAttacked?: number;
}
