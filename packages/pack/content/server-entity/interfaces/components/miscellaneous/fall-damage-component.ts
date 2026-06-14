/**
 * Interface for the fall_damage component
 * Defines the amount of damage an entity takes when falling.
 */
export interface FallDamageComponent {
  /**
   * The amount of damage an entity takes when falling.
   * @default 1
   */
  value?: number;
}
