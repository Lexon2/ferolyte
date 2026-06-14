/**
 * Interface for the WaterMovementComponent
 * Defines the speed with which an entity can move through water
 */
export interface WaterMovementComponent {
  /**
   * The drag factor to determine movement speed when in water
   * @default 0.8
   */
  dragFactor?: number;
}