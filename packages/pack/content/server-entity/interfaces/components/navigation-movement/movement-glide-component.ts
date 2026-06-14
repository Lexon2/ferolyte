import { MaxTurn } from "./max-turn";

/**
 * Interface for the movement_glide component
 * This is the move control for a flying mob that has a gliding movement.
 */
export interface MovementGlideComponent extends MaxTurn {
  /** The speed when the entity starts gliding */
  startSpeed?: number;

  /** The speed when the entity is turning while gliding */
  speedWhenTurning?: number;
}
