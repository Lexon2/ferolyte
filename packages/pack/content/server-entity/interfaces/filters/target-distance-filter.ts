import { BaseFilter } from './base-filter';

/**
 * Tests the distance between the calling entity and its target
 */
export interface TargetDistanceFilter extends BaseFilter {
  /**
   * The distance value to compare with
   */
  value: number;
}
