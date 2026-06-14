import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the ravager_blocked component
 * Defines the ravager's response to their melee attack being blocked.
 */
export interface RavagerBlockedComponent {
  /**
   * The strength with which blocking entities should be knocked back
   * @default 3.0
   */
  knockbackStrength?: number;

  /**
   * A list of weighted responses to the melee attack being blocked
   */
  reactionChoices?: Array<{
    /**
     * The chance of this reaction being picked
     */
    weight: number;

    /**
     * An event that runs when this reaction is picked
     */
    value: EntityEventTrigger;
  }>;
}
