/**
 * Interface for the player.exhaustion component
 * Defines the player's exhaustion level.
 */
export interface PlayerExhaustionComponent {
  /**
   * The initial value of the player exhaustion
   */
  value?: number;

  /**
   * The maximum player exhaustion of this entity
   */
  max?: number;
}
