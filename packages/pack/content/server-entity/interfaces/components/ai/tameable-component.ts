import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the tameable component
 * Defines the rules for a mob to be tamed by the player
 */
export interface TameableComponent {
  /**
   * The chance of taming the entity with each item use between 0.0 and 1.0, where 1.0 is 100%
   * @default 1
   */
  probability?: number;

  /**
   * Event to run when this entity becomes tamed
   */
  tameEvent?: EntityEventTrigger;

  /**
   * The list of items that can be used to tame this entity
   */
  tameItems?: string[];

  /**
   * Maximum number of failed tame attempts
   * @default 0
   */
  attemptTemperMod?: number;

  /**
   * Minimum temper level required for taming
   * @default 0
   */
  minTemper?: number;

  /**
   * Maximum temper level that can be achieved
   * @default 100
   */
  maxTemper?: number;
}
