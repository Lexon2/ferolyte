/**
 * Interface for the equip_item component
 * The entity puts on the desired equipment
 */
export interface EquipItemComponent {
  /**
   * List of items that the entity should not equip
   */
  excludedItems?: Array<{
    /**
     * Item that the entity should not equip
     */
    item: string;
  }>;
}
