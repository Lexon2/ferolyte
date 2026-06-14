/**
 * Interface for the friction_modifier component
 * Defines how much does friction affect this entity.
 */
export interface FrictionModifierComponent {
  /**
   * The higher the number, the more the friction affects this entity.
   * A value of 1.0 means regular friction, while 2.0 means twice as much
   * @default 1.0
   */
  value?: number;
}
