/**
 * Interface for the vertical_movement_action component
 * When configured as a rideable entity, the entity will move upwards or downwards when the player uses the jump action.
 */
export interface VerticalMovementActionComponent {
  /**
   * Vertical velocity to apply when jump action is issued.
   */
  verticalVelocity?: number;
}
