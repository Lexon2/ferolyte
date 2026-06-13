/**
 * Interface for the free_camera_controlled component
 * When configured as a rideable entity, the entity will be controlled using WASD controls and mouse to move in three dimensions.
 */
export interface FreeCameraControlledComponent {
  /**
   * Modifies speed going backwards.
   */
  backwardsMovementModifier?: number;

  /**
   * Modifies the strafe speed.
   */
  strafeSpeedModifier?: number;
}
