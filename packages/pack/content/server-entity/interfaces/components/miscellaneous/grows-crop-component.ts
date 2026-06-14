/**
 * Interface for the grows_crop component
 * Could increase crop growth when entity walks over crop.
 */
export interface GrowsCropComponent {
  /**
   * Value between 0-1. Chance of success per tick.
   * @default 0
   */
  chance?: number;

  /**
   * Number of charges.
   * @default 10
   */
  charges?: number;
}
