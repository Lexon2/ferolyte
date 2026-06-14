/**
 * Interface for the combat_regeneration component
 * Gives Regeneration I and removes Mining Fatigue from the mob that kills the Actor`s attack target.
 */
export interface CombatRegenerationComponent {
  /**
   * Determines if the mob will grant mobs of the same type combat buffs if they kill the target
   * @default false
   */
  applyToFamily?: boolean;

  /**
   * Determines if the mob will grant itself the combat buffs if it kills the target
   * @default false
   */
  applyToSelf?: boolean;

  /**
   * The duration in seconds of Regeneration I added to the mob
   * @default 5
   */
  regenerationDuration?: number | 'infinite';
}
