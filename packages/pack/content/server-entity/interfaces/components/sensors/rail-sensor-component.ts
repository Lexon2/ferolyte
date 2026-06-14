import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the rail_sensor component
 * Defines the behavior of the entity when the rail gets activated or deactivated
 */
export interface RailSensorComponent {
  /**
   * If true, on tick this entity will trigger its on_deactivate behavior
   * @default false
   */
  checkBlockTypes?: boolean;

  /**
   * If true, this entity will eject all of its riders when it passes over an activated rail
   * @default true
   */
  ejectOnActivate?: boolean;

  /**
   * If true, this entity will eject all of its riders when it passes over a deactivated rail
   * @default false
   */
  ejectOnDeactivate?: boolean;

  /**
   * Event to call when the rail is activated
   */
  onActivate?: EntityEventTrigger;

  /**
   * Event to call when the rail is deactivated
   */
  onDeactivate?: EntityEventTrigger;

  /**
   * If true, command blocks will start ticking when passing over an activated rail
   * @default true
   */
  tickCommandBlockOnActivate?: boolean;

  /**
   * If false, command blocks will stop ticking when passing over a deactivated rail
   * @default false
   */
  tickCommandBlockOnDeactivate?: boolean;
}
