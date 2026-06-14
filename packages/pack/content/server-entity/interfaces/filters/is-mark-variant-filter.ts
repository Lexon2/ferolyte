import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is the mark variant number provided
 */
export interface IsMarkVariantFilter extends BaseFilter {
  /**
   * The mark variant number to compare with
   */
  value: number;
}
