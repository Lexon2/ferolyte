/**
 * Interface for the transformation component
 * Defines an entity's transformation from the current definition into another
 */
export interface TransformationComponent {
  /**
   * List of components to add to the entity after the transformation
   */
  add?: {
    /**
     * Names of component groups to add
     */
    componentGroups?: string[];
  };

  /**
   * Sound to play when the transformation starts
   */
  beginTransformSound?: string;

  /**
   * Defines the properties of the delay for the transformation
   */
  delay?: number | {
    /**
     * Chance that the entity will look for nearby blocks that can speed up the transformation
     * @default 0
     */
    blockAssistChance?: number;

    /**
     * Chance that, once a block is found, will help speed up the transformation
     * @default 0
     */
    blockChance?: number;

    /**
     * Maximum number of blocks the entity will look for to aid in the transformation
     * @default 0
     */
    blockMax?: number;

    /**
     * Distance in Blocks that the entity will search for blocks that can help the transformation
     * @default 0
     */
    blockRadius?: number;

    /**
     * List of blocks that can help the transformation of this entity
     */
    blockTypes?: string[];

    /**
     * Time in seconds before the entity transforms
     * @default 0
     */
    value?: number;
  };

  /**
   * Cause the entity to drop all equipment upon transformation
   * @default false
   */
  dropEquipment?: boolean;

  /**
   * Cause the entity to drop all items in inventory upon transformation
   * @default false
   */
  dropInventory?: boolean;

  /**
   * Entity Definition that this entity will transform into
   * @default ""
   */
  into?: string;

  /**
   * If this entity has trades and has leveled up, it should maintain that level after transformation
   * @default false
   */
  keepLevel?: boolean;

  /**
   * If this entity is owned by another entity, it should remain owned after transformation
   * @default false
   */
  keepOwner?: boolean;

  /**
   * Cause the entity to keep equipment after going through transformation
   * @default false
   */
  preserveEquipment?: boolean;

  /**
   * Sound to play when the entity is done transforming
   * @default ""
   */
  transformationSound?: string;
}
