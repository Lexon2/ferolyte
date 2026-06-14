import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the environment_sensor component
 * Creates a trigger based on environment conditions
 */
export interface EnvironmentSensorComponent {
  /**
   * The list of triggers that fire when the environment conditions match the given filter criteria
   */
  triggers: Array<EntityEventTrigger>;
}
