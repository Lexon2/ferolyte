import { EntityFilters } from '../../filters';

/**
 * Interface for the group_size component
 * Keeps track of entity group size in the given radius
 */
export interface GroupSizeComponent {
  /**
   * The list of conditions that must be satisfied for other entities to be counted towards group size
   */
  filters?: EntityFilters;

  /**
   * Radius from center of entity
   * @default 16
   */
  radius?: number;
}
