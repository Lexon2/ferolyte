/**
 * Interface for the instant_despawn component
 * Despawns the Actor immediately.
 */
export interface InstantDespawnComponent {
  /**
   * If true, all entities linked to this entity in a child relationship (eg. leashed) will also be despawned
   * @default false
   */
  removeChildEntities?: boolean;
}
