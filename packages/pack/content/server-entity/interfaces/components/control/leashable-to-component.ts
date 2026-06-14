/**
 * Allows players to leash entities to this entity, retrieve entities already leashed to it, or free them using shears.
 * For the last interaction to work, the leashed entities must have "can_be_cut" set to true in their "minecraft:leashable" component.
 */
export interface LeashableToComponent {
  /**
   * Allows players to retrieve entities that are leashed to this entity.
   * @default false
   */
  canRetrieveFrom?: boolean;
}
