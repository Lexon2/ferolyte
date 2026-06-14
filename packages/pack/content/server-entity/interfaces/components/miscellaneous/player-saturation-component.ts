/**
 * Interface for the player.saturation component
 * Defines the player's need for food.
 */
export interface PlayerSaturationComponent {
  /**
   * The initial value of player saturation
   */
  value?: number;

  /**
   * The maximum player saturation value
   */
  max?: number;
}
