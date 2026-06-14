/**
 * Interface for the addrider component
 * Adds a rider to the entity. Requires `minecraft:rideable.`
 */
export interface AddRiderComponent {
  /**
   * The entity type that will be riding this entity
   */
  entityType: string;

  /**
   * The spawn event that will be used when the riding entity is created
   */
  spawnEvent?: string;
}
