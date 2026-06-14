import { EquipmentSlot } from '../../../constants/equipment-slots';

/**
 * Interface for the equipment component
 * Allows an entity to spawn with equipment
 */
export interface EquipmentComponent {
  /**
   * Table of equipment to use
   */
  table?: string;

  /**
   * Slot to drop chance mappings for specific equipment items
   */
  slotDropChance?: {
    /**
     * Drop chance for the slot
     */
    dropChance: number;

    /**
     * Slot to drop from
     */
    slot: EquipmentSlot;
  }[];
}
