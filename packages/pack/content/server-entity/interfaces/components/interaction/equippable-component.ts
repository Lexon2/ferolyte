import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the equippable component
 * Defines an entity's behavior for having items equipped to it
 */
export interface EquippableComponent {
  /**
   * List of slots and the item that can be equipped
   */
  slots?: Array<EquippableSlot>;
}

/**
 * Interface for a single slot entry in the equippable component
 * Defines a slot and the item that can be equipped
 */
export interface EquippableSlot {
  /**
   * The slot number of this slot
   * @default 0
   */
  slot?: number;
  /**
   * The item that can be equipped for this slot
   */
  item?: string;
  /**
   * Text to be displayed when the entity can be equipped with this item when playing with Touch-screen controls
   */
  interactText?: string;
  /**
   * Event to trigger when this entity is equipped with this item
   */
  onEquip?: EntityEventTrigger;
  /**
   * Event to trigger when this item is removed from this entity
   */
  onUnequip?: EntityEventTrigger;
}
