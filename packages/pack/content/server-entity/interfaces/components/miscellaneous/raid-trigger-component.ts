import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the raid_trigger component
 * Attempts to trigger a raid at the entity's location.
 */
export interface RaidTriggerComponent {
  /**
   * Event to run when attempting to trigger a raid on the village
   */
  triggeredEvent?: EntityEventTrigger;
}
