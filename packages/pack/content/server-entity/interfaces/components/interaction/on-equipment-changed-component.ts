import { EntityEventTrigger } from '../../trigger';

/**
 * Slot configuration for on_equipment_changed component
 */
export interface OnEquipmentChangedSlot {
  /**
   * The slot number of this slot.
   * @default 0
   */
  slot?: number;

  /**
   * Event to execute when the slot is changed to a non-empty item.
   */
  onEquip?: EntityEventTrigger;

  /**
   * Event to execute when the slot is changed to an empty item.
   */
  onUnequip?: EntityEventTrigger;
}

/**
 * Interface for the on_equipment_changed component
 * Allows specifying events to execute when equipment is set in the entity's default equipment slots.
 */
export interface OnEquipmentChangedComponent {
  /**
   * Slot-specific events to execute when the entity's equipment changes.
   */
  slots?: OnEquipmentChangedSlot[];
}
