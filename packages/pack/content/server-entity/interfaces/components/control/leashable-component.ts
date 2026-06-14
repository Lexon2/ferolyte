import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the leashable component
 * Allows this entity to be leashed and defines the conditions and events for this entity when is leashed.
 */
export interface LeashableComponent {
  /**
   * If true, players can leash this entity even if it is already leashed to another mob
   * @default false
   */
  canBeStolen?: boolean;

  /**
   * When set to true, "on_unleash" does not trigger when the entity gets unleashed for other reasons such as being stolen or the leash breaking
   * @default false
   */
  onUnleashInteractOnly?: boolean;

  /**
   * Distance in blocks at which the leash stiffens, restricting movement
   * @default 6
   */
  hardDistance?: number;

  /**
   * Distance in blocks at which the leash breaks
   * @default 10
   */
  maxDistance?: number;

  /**
   * Event to call when this entity is leashed
   */
  onLeash?: EntityEventTrigger;

  /**
   * Event to call when this entity is unleashed
   */
  onUnleash?: EntityEventTrigger;

  /**
   * Distance in blocks at which the `spring` effect starts acting to keep this entity close to the entity that leashed it
   * @default 4
   */
  softDistance?: number;

  /**
   * Defines how this entity behaves when leashed to another entity
   */
  presets?: Array<{
    /**
     * The filter group that defines the conditions for using this preset
     */
    filter?: EntityFilters;

    /**
     * Distance in blocks at which the leash stiffens, restricting movement
     */
    hardDistance?: number;

    /**
     * Distance in blocks at which the leash breaks
     */
    maxDistance?: number;

    /**
     * Distance in blocks at which the `spring` effect starts acting
     */
    softDistance?: number;

    /**
     * The type of spring to use
     */
    springType?: 'bouncy' | 'quad_dampened' | 'dampened';
  }>;
}
