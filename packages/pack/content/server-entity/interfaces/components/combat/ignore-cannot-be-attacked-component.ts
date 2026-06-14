import { EntityFilters } from '../../filters';

/**
 * Interface for the ignore_cannot_be_attacked component
 * When set, allows the entity to attack entities that have the "minecraft:cannot_be_attacked" component.
 */
export interface IgnoreCannotBeAttackedComponent {
  /**
   * Defines which entities are exceptions and are allowed to be attacked by the owner entity, potentially attacked entity is subject "other". If this is not specified then all attacks by the owner are allowed.
   */
  filters?: EntityFilters;
}
