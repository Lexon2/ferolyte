import { EntityFilters } from "../../filters";

/**
 * Interface for the despawn component
 * Despawns the Actor when the despawn rules or optional filters evaluate to true.
 */
export interface DespawnComponent {
  /**
   * Determines if `min_range_random_chance` is used in the standard despawn rules
   * @default true
   */
  despawnFromChance?: boolean;
  /**
   * Defines the minimum and maximum distance for despawn to occur
   * @default { maxDistance: 128, minDistance: 32 }
   */
  despawnFromDistance?: {
    /**
     * Maximum distance for standard despawn rules to instantly despawn the mob
     * @default 128
     */
    maxDistance?: number;
    /**
     * Minimum distance for standard despawn rules to try to despawn the mob
     * @default 32
     */
    minDistance?: number;
  };
  /**
   * Determines if the `min_range_inactivity_timer` is used in the standard despawn rules
   * @default true
   */
  despawnFromInactivity?: boolean;
  /**
   * Determines if the mob is instantly despawned at the edge of simulation distance in the standard despawn rules
   * @default true
   */
  despawnFromSimulationEdge?: boolean;
  /**
   * The list of conditions that must be satisfied before the Actor is despawned
   * @default []
   */
  filters?: EntityFilters;
  /**
   * The amount of time in seconds that the mob must be inactive
   * @default 0
   */
  minRangeInactivityTimer?: number;
  /**
   * A random chance between 1 and the given value
   * @default 0
   */
  minRangeRandomChance?: number;
  /**
   * If true, all entities linked to this entity in a child relationship will also be despawned
   * @default false
   */
  removeChildEntities?: boolean;
}
