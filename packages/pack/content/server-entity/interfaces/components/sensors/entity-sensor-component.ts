import { EntityFilters } from '../../filters';

/**
 * Interface for a subsensor in the entity_sensor component
 * Defines the conditions and behavior for a single subsensor
 */
export interface Subsensor {
  /**
   * How many seconds should elapse before the subsensor can once again sense for entities
   * The cooldown is applied on top of the base 1 tick (0.05 seconds) delay
   * Negative values will result in no cooldown being used
   * @default -1
   */
  cooldown?: number;

  /**
   * Vertical offset applied to the entity's position when computing the distance from other entities
   * @default 0
   */
  yOffset?: number;

  /**
   * Event filters to apply
   */
  eventFilters?: EntityFilters;

  /**
   * Event to trigger
   */
  event: string;

  /**
   * The maximum number of entities that must pass the filter conditions for the event to send
   * @default -1
   */
  maximumCount?: number;

  /**
   * The minimum number of entities that must pass the filter conditions for the event to send
   * @default 1
   */
  minimumCount?: number;

  /**
   * The maximum distance another entity can be from this and have the filters checked against it
   * @default [10, 10]
   */
  range?: [number, number];

  /**
   * If true requires all nearby entities to pass the filter conditions for the event to send
   * @default false
   */
  requireAll?: boolean;

  /**
   * The maximum distance another entity can be from this and have the filters checked against it
   * @default 10
   */
  sensorRange?: number;
}

/**
 * Interface for the entity_sensor component
 * A component that fires an event when a set of conditions are met by other entities within the defined range
 */
export interface EntitySensorComponent {
  /**
   * If true the sensor range is additive on top of the entity's size
   * @default true
   */
  relativeRange?: boolean;

  /**
   * The list of subsensors
   */
  subsensors?: Subsensor[];

  /**
   * Limits the search to Players only for all subsensors
   * @default true
   */
  findPlayersOnly?: boolean;
}
