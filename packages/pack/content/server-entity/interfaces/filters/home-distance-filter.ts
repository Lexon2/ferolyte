import { BaseFilter } from './base-filter';

/**
 * Tests the distance between the subject and its home
 */
export interface HomeDistanceFilter extends BaseFilter {
  /**
   * A floating point value
   */
  value: number;
}
