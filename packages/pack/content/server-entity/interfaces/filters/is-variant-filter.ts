import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is the variant number provided
 */
export interface IsVariantFilter extends BaseFilter {
  /**
   * The variant number to compare with
   */
  value: number;
}
