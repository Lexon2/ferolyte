import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the sittable component
 * Defines the entity's `sit` state
 */
export interface SittableComponent {
  /**
   * Event to run when the entity enters the `sit` state
   */
  sitEvent?: EntityEventTrigger;

  /**
   * Event to run when the entity exits the `sit` state
   */
  standEvent?: EntityEventTrigger;
}
