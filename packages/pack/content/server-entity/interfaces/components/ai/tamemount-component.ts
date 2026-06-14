import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the tamemount component
 * Allows the Entity to be tamed by mounting it
 */
export interface TamemountComponent {
  /**
   * The amount the entity's temper will increase when mounted
   * @default 5
   */
  attemptTemperMod?: number;

  /**
   * The list of items that, if carried while interacting with the entity, will anger it
   */
  autoRejectItems?: Array<{
    /**
     * Name of the item this entity dislikes and will cause it to get angry if used while untamed
     */
    item: string;
  }>;

  /**
   * The text that shows in the feeding interact button
   * @default "Feed"
   */
  feedText?: string;

  /**
   * The list of items that can be used to increase the entity's temper and speed up the taming process
   */
  feedItems?: Array<{
    /**
     * Name of the item this entity likes and can be used to increase this entity's temper
     */
    item: string;

    /**
     * The amount of temper this entity gains when fed this item
     * @default 0
     */
    temperMod?: number;
  }>;

  /**
   * The maximum value for the entity's random starting temper
   * @default 100
   */
  maxTemper?: number;

  /**
   * The minimum value for the entity's random starting temper
   * @default 0
   */
  minTemper?: number;

  /**
   * The text that shows in the riding interact button
   * @default "Ride"
   */
  rideText?: string;

  /**
   * Event that triggers when the entity becomes tamed
   */
  tameEvent?: EntityEventTrigger;
}
