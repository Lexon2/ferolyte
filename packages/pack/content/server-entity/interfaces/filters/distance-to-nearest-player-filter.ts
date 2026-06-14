import { BaseFilter } from './base-filter';

/**
 * Compares the distance to the nearest Player with a float value
 */
export interface DistanceToNearestPlayerFilter extends BaseFilter {
  /**
   * The distance value to test against
   */
  value: number;
}
