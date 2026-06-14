/**
 * Interface for the loot component
 * Sets the loot table for what items this entity drops upon death.
 */
export interface LootComponent {
  /**
   * The path to the loot table, relative to the Behavior Pack's root
   * @default "loot_tables/empty.json"
   */
  table: string;
}
