/**
 * Interface for the attribute component
 * Used for components like health, movement, attack_damage, etc.
 */
export interface AttributeComponent {
  /**
   * Current value of the attribute
   */
  value: number;

  /**
   * Minimum value the attribute can have
   */
  min?: number;

  /**
   * Maximum value the attribute can have
   */
  max?: number;
}
