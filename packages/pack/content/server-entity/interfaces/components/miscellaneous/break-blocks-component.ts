/**
 * Interface for the break_blocks component
 * Specifies the blocks that this entity can break as it moves around.
 */
export interface BreakBlocksComponent {
  /**
   * A list of the blocks that can be broken as this entity moves around
   */
  breakableBlocks?: string[];
}
