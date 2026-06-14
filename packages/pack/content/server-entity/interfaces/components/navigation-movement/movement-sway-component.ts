import { MaxTurn } from "./max-turn";

/**
 * Interface for the movement_sway component
 * This move control causes the mob to sway side to side giving the impression it is swimming.
 */
export interface MovementSwayComponent extends MaxTurn {
  /**
   * Strength of the sway movement.
   * @default 0.05
   */
  swayAmplitude?: number;

  /**
   * Multiplier for the frequency of the sway movement.
   * @default 0.5
   */
  swayFrequency?: number;
}
