/**
 * Interface for the tick_world component
 * Defines if the entity ticks the world and the radius around it to tick
 */
export interface TickWorldComponent {
  /**
   * The distance at which the closest player has to be before this entity despawns
   * @default 128
   */
  distanceToPlayers?: number;

  /**
   * If true, this entity will not despawn even if players are far away
   * @default true
   */
  neverDespawn?: boolean;

  /**
   * The area around the entity to tick
   * @default 2
   */
  radius?: number;
}
