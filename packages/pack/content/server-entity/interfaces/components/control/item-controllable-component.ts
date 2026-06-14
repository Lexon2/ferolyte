
/**
 * Interface for the item controllable component
 * Defines what items can be used to control this entity while ridden
 */
export interface ItemControllableComponent {
  /**
   * List of items that can be used to control this entity
   */
  controlItems: string[] | string;
}
