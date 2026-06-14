/**
 * Interface for the horse.jump_strength component
 * Allows this mob to jump higher when being ridden by a player.
 */
export interface HorseJumpStrengthComponent {
  /**
   * The multiplier to apply to the jumping height
   */
  value?: number | {
    /**
     * Minimum range value
     */
    rangeMin?: number;

    /**
     * Maximum range value
     */
    rangeMax?: number;
  };
}
