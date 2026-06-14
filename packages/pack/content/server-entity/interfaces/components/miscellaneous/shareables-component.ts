/**
 * Interface for the shareables component
 * Defines a list of items the mob wants to share or pick up.
 */
export interface ShareablesComponent {
  /**
   * A bucket for all other items in the game. Note this category is always least priority items
   * @default false
   */
  allItems?: boolean;

  /**
   * Maximum number of this item the mob will hold
   * @default -1
   */
  allItemsMaxAmount?: number;

  /**
   * Number of this item considered extra that the entity wants to share
   * @default -1
   */
  allItemsSurplusAmount?: number;

  /**
   * Number of this item this entity wants to share
   * @default -1
   */
  allItemsWantAmount?: number;

  /**
   * List of items that the entity wants to share
   */
  items?: Array<{
    /**
     * Mob will admire the item after picking up by looking at it
     */
    admire?: boolean;

    /**
     * Mob will barter for the item after picking it up
     */
    barter?: boolean;

    /**
     * Determines whether the mob will consume the item or not
     */
    consumeItem?: boolean;

    /**
     * Defines the item this entity wants to craft with the item defined above
     */
    craftInto?: string;

    /**
     * The name of the item
     */
    item: string;

    /**
     * Aux value for the item
     */
    itemAux?: number;

    /**
     * Maximum number of this item the mob will hold
     */
    maxAmount?: number;

    /**
     * Maximum number of this item the mob will pick up during a single goal tick
     */
    pickupLimit?: number;

    /**
     * Prioritizes which items the entity prefers. 0 is the highest priority
     */
    priority?: number;

    /**
     * Determines whether the mob will try to put the item in its inventory if it has the inventory component and if it can't be equipped
     */
    storedInInventory?: boolean;

    /**
     * Number of this item considered extra that the entity wants to share
     */
    surplusAmount?: number;

    /**
     * Number of this item this entity wants to have
     */
    wantAmount?: number;

    /**
     * Determines whether the mob can only pickup the item and not drop it
     * @default false
     */
    pickupOnly?: boolean;
  }>;

  /**
   * Determines whether the mob can only pickup one item at a time
   */
  singularPickup?: boolean;
}
