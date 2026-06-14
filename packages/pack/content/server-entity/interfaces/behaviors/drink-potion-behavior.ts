import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows the mob to drink potions based on specified environment conditions.
 */
export interface DrinkPotionBehavior extends BehaviorPriority {
  /**
   * Movement speed modifier of the mob when using this AI Goal
   * @default 0.0
   */
  speedModifier?: number;

  /**
   * A list of potions that this entity can drink
   */
  potions?: {
    /**
     * The registry ID of the potion to use
     * @default -1
     */
    id?: number;

    /**
     * The percent chance (from 0.0 to 1.0) of this potion being selected when searching for a potion to use
     * @default 1.0
     */
    chance?: number;

    /**
     * The filters to use when determining if this potion can be selected
     */
    filters?: EntityFilters;
  }[];
}
