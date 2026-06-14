import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the timer component
 * Adds a timer after which an event will fire.
 */
export interface TimerComponent {
  /**
   * If true, the timer will restart every time after it fires
   * @default false
   */
  looping?: boolean;

  /**
   * If true, the amount of time on the timer will be random between the Minimum and Maximum values specified in time
   * @default true
   */
  randomInterval?: boolean;

  /**
   * Amount of time in seconds for the timer. Can be specified as a number or a Molang expression that evaluates to a number
   */
  time: number | string;

  /**
   * Event to fire when the time on the timer runs out
   */
  timeDownEvent: EntityEventTrigger;

  /**
   * List of objects representing one value in seconds that can be picked before firing the event and an optional weight
   * Incompatible with time
   * @default []
   */
  randomTimeChoices?: Array<{
    /**
     * The weight on how likely this section is to trigger
     */
    weight?: number;

    /**
     * The value in seconds that would be used if this section was picked
     */
    value: number;
  }>;
}
