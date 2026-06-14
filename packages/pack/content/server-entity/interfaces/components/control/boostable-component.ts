/**
 * Interface for the boostable component
 * Defines the conditions and behavior of a rideable entity's boost.
 */
export interface BoostableComponent {
  /**
   * Time in seconds for the boost
   * @default 3
   */
  duration?: number;
  /**
   * Factor by which the entity's normal speed increases. E.g. 2.0 means go twice as fast
   * @default 1
   */
  speedMultiplier?: number;
  /** List of items that can be used to boost while riding this entity */
  boostItems?: Array<{
    /**
     * This is the damage that the item will take each time it is used
     * @default 1
     */
    damage?: number;
    /**
     * Name of the item that can be used to boost
     */
    item?: string;
    /**
     * The item used to boost will become this item once it is used up
     */
    replaceItem?: string;
  }>;
}
