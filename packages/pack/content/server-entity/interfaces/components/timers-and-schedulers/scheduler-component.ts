import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the scheduler component
 * fires off scheduled mob events at time of day events.
 */
export interface SchedulerComponent {
  /**
   * The minimum the scheduler will be delayed
   * @default 0
   */
  minDelaySecs?: number;

  /**
   * The maximum the scheduler will be delayed
   * @default 0
   */
  maxDelaySecs?: number;

  /**
   * The list of triggers that fire when the conditions match the given filter criteria
   * If any filter criteria overlap the first defined event will be picked
   * @default []
   */
  scheduledEvents?: Array<{
    /**
     * Filter criteria for the event
     */
    filters?: EntityFilters;

    /**
     * The event to trigger
     */
    event: EntityEventTrigger;
  }>;
}
