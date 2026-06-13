import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity's vehicle is a member of the named family
 */
export interface IsVehicleFamilyFilter extends BaseFilter {
  /**
   * The family name to look for
   */
  value: string;
}
