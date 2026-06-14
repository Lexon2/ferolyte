import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the drying_out_timer component
 * Adds a timer for drying out that will count down and fire `dried_out_event` or will stop as soon as the entity will get under rain or water and fire `stopped_drying_out_event`.
 */
export interface DryingOutTimerComponent {
  /**
   * Event to fire when the drying out time runs out
   */
  driedOutEvent?: EntityEventTrigger;

  /**
   * Event to fire when entity was already dried out but received increase in water supply
   */
  recoverAfterDriedOutEvent?: EntityEventTrigger;

  /**
   * Event to fire when entity stopped drying out, for example got into water or under rain
   */
  stoppedDryingOutEvent?: EntityEventTrigger;

  /**
   * Amount of time in seconds to dry out fully
   * @default 0
   */
  totalTime?: number;

  /**
   * Optional amount of additional time in seconds given by using splash water bottle on entity
   * @default 0
   */
  waterBottleRefillTime?: number;
}
