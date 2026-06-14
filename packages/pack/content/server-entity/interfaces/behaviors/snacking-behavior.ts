import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to take a load off and snack on food that it found nearby.
 */
export interface SnackingBehavior extends BehaviorPriority {
  /**
   * Items that we are interested in snacking on
   */
  items?: string | string[];

  /**
   * The cooldown time in seconds before the mob is able to snack again
   * @default 7.5
   */
  snackingCooldown?: number;

  /**
   * The minimum time in seconds before the mob is able to snack again
   * @default 0.5
   */
  snackingCooldownMin?: number;

  /**
   * This is the chance that the mob will stop snacking, from 0 to 1
   */
  snackingStopChance?: number;
}
