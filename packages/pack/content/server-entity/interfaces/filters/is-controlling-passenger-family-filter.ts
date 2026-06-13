import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity's controlling passenger is a member of the named family
 */
export interface IsControllingPassengerFamilyFilter extends BaseFilter {
  /**
   * The family name to look for
   */
  value: string;
}
