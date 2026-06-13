import { EntityFilters } from '../../filters';

/**
 * Interface for the spawn_on_death component
 * Component for spawning entities when an entity perishes.
 */
export interface SpawnOnDeathComponent {
  /**
   * Additional random range of entities to spawn.
   */
  additionalSpawnRange?: { min?: number; max?: number };

  /**
   * What entity to spawn. Defaults to owning entity when not set.
   */
  entityToSpawn?: string;

  /**
   * Conditions that need to be met for spawning.
   */
  filters?: EntityFilters;

  /**
   * If true, the entity will inherit the name of the parent entity.
   * @default true
   */
  inheritParentName?: boolean;

  /**
   * How many entities to spawn.
   * @default 1
   */
  spawnAmount?: number;

  /**
   * Spawn method.
   * @default "spawned"
   */
  spawnMethod?: 'born' | 'spawned' | 'summoned';
}
