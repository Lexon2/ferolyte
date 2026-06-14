/**
 * Interface for the player.experience component
 * Defines how much experience each player action should take.
 */
export interface PlayerExperienceComponent {
  /**
   * The initial value of the player experience
   * @default 1
   */
  value?: number;

  /**
   * The maximum player experience of this entity
   * @default 5
   */
  max?: number;
}
