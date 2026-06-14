import { HomeRestrictionType } from '../../../convertors/validation/home-restriction-type';

/**
 * Interface for the home component
 * Defines the entity's home position and behavior.
 */
export interface HomeComponent {
  /**
   * The radius that the entity will be restricted to in relation to its home
   */
  restrictionRadius?: number;

  /**
   * The block that the entity will be restricted to in relation to its home
   */
  homeBlockList?: string[];

  /**
   * Defines how the the entity will be restricted to its home position. The possible values are:
   * - 'none', which poses no restriction.
   * - 'random_movement', which restricts randomized movement to be around the home position.
   * - 'all_movement', which restricts any kind of movement to be around the home position. However, entities that somehow got too far away from their home will always be able to move closer to it, if prompted to do so.
   */
  restrictionType?: HomeRestrictionType;
}
