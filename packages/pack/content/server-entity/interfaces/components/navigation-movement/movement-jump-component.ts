import { MaxTurn } from "./max-turn";

/**
 * Interface for the movement_jump component
 * Move control that causes the mob to jump as it moves with a specified delay between jumps.
 */
export interface MovementJumpComponent extends MaxTurn {
  /**
   * Delay after landing when using the jump move control.
   * Array with [minimum, maximum] values.
   * @default [0.0, 0.0]
   */
  jumpDelay?: number[];
}
