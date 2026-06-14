import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the target_nearby_sensor component
 * Defines the entity's range within which it can see or sense other entities to target them
 */
export interface TargetNearbySensorComponent {
  /**
   * Whether the other entity needs to be visible to trigger inside events
   * @default false
   */
  mustSee?: boolean;

  /**
   * Maximum distance in blocks that another entity will be considered in the inside range
   * @default 1
   */
  insideRange?: number;

  /**
   * Event to call when an entity gets in the inside range
   * Can specify event for the name of the event and target for the target of the event
   */
  onInsideRange?: EntityEventTrigger;

  /**
   * Event to call when an entity gets in the outside range
   * Can specify event for the name of the event and target for the target of the event
   */
  onOutsideRange?: EntityEventTrigger;

  /**
   * Event to call when an entity exits visual range
   * Can specify event for the name of the event and target for the target of the event
   */
  onVisionLostInsideRange?: EntityEventTrigger;

  /**
   * Maximum distance in blocks that another entity will be considered in the outside range
   * @default 5
   */
  outsideRange?: number;
}
