import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the ageable component
 * Adds a timer for the entity to grow up. It can be accelerated by giving the entity the items it likes as defined by feedItems.
 */
export interface AgeableComponent {
  /**
   * List of items that the entity drops when it grows up
   */
  dropItems?: string | string[];

  /**
   * Amount of time before the entity grows up, -1 for always a baby
   * @default 1200
   */
  duration?: number;

  /**
   * List of items that can be fed to the entity
   */
  feedItems?:
    | string
    | Array<{
        /**
         * How much time it grows up by
         */
        growth?: number;

        /**
         * The item name
         */
        item: string;
      }>;

  /**
   * Event to run when this entity grows up
   */
  growUp?: EntityEventTrigger;

  /**
   * The feed item used will transform to this item upon successful interaction
   */
  transformToItem?: string;

  /**
   * List of conditions to meet so that the entity can be fed
   */
  interactFilters?: EntityFilters;
}
