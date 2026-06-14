import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the peek component
 * Defines the entity's `peek` behavior, defining the events that should be called during it.
 */
export interface PeekComponent {
  /**
   * Event to call when the entity is done peeking
   */
  onClose?: EntityEventTrigger;

  /**
   * Event to call when the entity starts peeking
   */
  onOpen?: EntityEventTrigger;

  /**
   * Event to call when the entity's target entity starts peeking
   */
  onTargetOpen?: EntityEventTrigger;
}
