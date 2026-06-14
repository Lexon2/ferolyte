/**
 * Interface for the digger component
 * @description Defines how an item can break blocks with specific efficiency
 */
export interface ItemDiggerComponent {
  /**
   * Toggles if the item will be used efficiently.
   * @default false
   */
  useEfficiency?: boolean;

  /**
   * List of blocks and their destruction speeds with this item
   */
  destroySpeeds: Array<{
    /**
     * The speed at which the block is destroyed
     */
    speed: number;

    /**
     * The block identifier or block tag
     */
    block: string | { tags: string };
  }>;
}
