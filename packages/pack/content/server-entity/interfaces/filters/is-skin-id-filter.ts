import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is the skin id number provided
 */
export interface IsSkinIdFilter extends BaseFilter {
  /**
   * The skin id number to compare with
   */
  value: number;
}
