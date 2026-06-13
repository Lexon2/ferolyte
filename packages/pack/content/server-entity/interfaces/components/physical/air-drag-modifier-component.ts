/**
 * Interface for the air_drag_modifier component
 * Defines how much air drag affects this entity.
 */
export interface AirDragModifierComponent {
  /**
   * The higher the number, the more air drag affects this entity.
   * A value of 1.0 means regular air drag, while 2.0 means twice as much.
   * @default 1
   */
  value?: number;
}
