import { DwellerComponentRole } from '../../../constants/dweller-role';
import { DwellerComponentType } from '../../../constants/dweller-type';

/**
 * Interface for the dweller component
 * Allows a mob to join and migrate between villages and other dwellings
 */
export interface DwellerComponent {
  /**
   * The type of dwelling the mob wishes to join
   */
  dwellingType?: DwellerComponentType;

  /**
   * The role of which the mob plays in the dwelling
   */
  dwellerRole?: DwellerComponentRole;

  /**
   * How often the mob checks on their dwelling status in ticks
   */
  updateIntervalBase?: number;

  /**
   * The variant value in ticks that will be added to the update_interval_base
   */
  updateIntervalVariant?: number;

  /**
   * Whether or not the mob can find and add POI's to the dwelling
   */
  canFindPoi?: boolean;

  /**
   * How much reputation should the players be rewarded on first founding
   */
  firstFoundingReward?: number;

  /**
   * Can this mob migrate between dwellings? Or does it only have its initial dwelling?
   */
  canMigrate?: boolean;

  /**
   * A padding distance for checking if the mob is within the dwelling
   */
  dwellingBoundsTolerance?: number;

  /**
   * Allows the user to define a starting profession for this particular Dweller, instead of letting them choose organically
   */
  preferredProfession?: string;
}
