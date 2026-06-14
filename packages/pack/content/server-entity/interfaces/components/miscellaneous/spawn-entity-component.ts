import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the spawn_entity component
 * Adds a timer after which this entity will spawn another entity or item (similar to vanilla's chicken's egg-laying behavior)
 */
export interface SpawnEntityComponent {
  /**
   * The entities to spawn
   */
  entities?: EntitySpawn | Array<EntitySpawn>;
}

export interface EntitySpawn {
  /**
   * If present, the specified entity will only spawn if the filter evaluates to true
   */
  filters?: EntityFilters;

  /**
   * Maximum amount of time to randomly wait in seconds before another entity is spawned
   * @default 600
   */
  maxWaitTime?: number;

  /**
   * Minimum amount of time to randomly wait in seconds before another entity is spawned
   * @default 300
   */
  minWaitTime?: number;

  /**
   * The number of entities of this type to spawn each time that this triggers
   * @default 1
   */
  numToSpawn?: number;

  /**
   * If true, this the spawned entity will be leashed to the parent
   * @default false
   */
  shouldLeash?: boolean;

  /**
   * If true, this component will only ever spawn the specified entity once
   * @default false
   */
  singleUse?: boolean;

  /**
   * Identifier of the entity to spawn, leave empty to spawn the item defined above instead
   */
  spawnEntity?: string;

  /**
   * Event to call when the entity is spawned
   * @default "minecraft:entity_born"
   */
  spawnEvent?: string;

  /**
   * Item identifier of the item to spawn
   * @default "egg"
   */
  spawnItem?: string;

  /**
   * Method to use to spawn the entity
   * @default "born"
   */
  spawnMethod?: string;

  /**
   * Identifier of the sound effect to play when the entity is spawned
   * @default "plop"
   */
  spawnSound?: string;

  /**
   * Event to call on this entity when the item is spawned
   */
  spawnItemEvent?: EntityEventTrigger;
}
