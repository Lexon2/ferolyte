import { ContainerType } from "../../../constants/container-types";

/**
 * Interface for the inventory component
 * Defines this entity's inventory properties
 */
export interface InventoryComponent {
  /**
   * Number of slots that this entity can gain per extra strength
   * @default 0
   */
  additionalSlotsPerStrength?: number;

  /**
   * If true, the contents of this inventory can be removed by a hopper
   * @default false
   */
  canBeSiphonedFrom?: boolean;

  /**
   * Type of container this entity has. Can be horse, minecart_chest, chest_boat, minecart_hopper, inventory, container or hopper
   * @default "none"
   */
  containerType?: ContainerType;

  /**
   * Number of slots the container has
   * @default 5
   */
  inventorySize?: number;

  /**
   * If true, only the entity can access the inventory
   * @default false
   */
  private?: boolean;

  /**
   * If true, the entity's inventory can only be accessed by its owner or itself
   * @default false
   */
  restrictToOwner?: boolean;
}
