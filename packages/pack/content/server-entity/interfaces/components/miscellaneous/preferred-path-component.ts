/**
 * Interface for the preferred_path component
 * Specifies costing information for mobs that prefer to walk on preferred paths.
 */
export interface PreferredPathComponent {
  /**
   * Cost for non-preferred blocks
   * @default 0
   */
  defaultBlockCost?: number;

  /**
   * Added cost for jumping up a node
   * @default 0
   */
  jumpCost?: number;

  /**
   * Distance mob can fall without taking damage
   * @default 3
   */
  maxFallBlocks?: number;

  /**
   * A list of blocks with their associated cost
   */
  preferredPathBlocks?: Array<{
    /**
     * Cost for the specified blocks
     */
    cost: number;

    /**
     * List of blocks with this cost
     */
    blocks: string[];
  }>;
}
