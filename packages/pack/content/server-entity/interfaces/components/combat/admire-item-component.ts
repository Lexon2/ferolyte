/**
 * Interface for the admire_item component
 * Causes the mob to ignore attackable targets for a given duration.
 */
export interface AdmireItemComponent {
  /**
   * Duration, in seconds, for which mob won't admire items if it was hurt
   * @default 0
   */
  cooldownAfterBeingAttacked?: number;

  /**
   * Duration, in seconds, that the mob is pacified
   * @default 10
   */
  duration?: number;
}
