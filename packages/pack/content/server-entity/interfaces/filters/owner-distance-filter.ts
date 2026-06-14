import { BaseFilter } from './base-filter';

/**
 * Tests the distance between the subject and its owner
 */
export interface OwnerDistanceFilter extends BaseFilter {
  /**
   * The distance value to compare with
   */
  value: number;
}
