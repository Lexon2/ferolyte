/**
 * Interface for the damage_over_time component
 * Applies defined amount of damage to the entity at specified intervals.
 */
export interface DamageOverTimeComponent {
  /**
   * Amount of damage caused each hurt
   * @default 1
   */
  damagePerHurt?: number;

  /**
   * Time in seconds between damage
   * @default 0
   */
  timeBetweenHurt?: number;
}
