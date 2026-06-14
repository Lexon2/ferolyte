import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is a member of the named family.
 */
export interface IsFamilyFilter extends BaseFilter {
  /**
   * The family name to look for
   */
  value: string;
}
