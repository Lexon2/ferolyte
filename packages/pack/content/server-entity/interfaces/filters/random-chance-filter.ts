import { BaseFilter } from './base-filter';

/**
 * Returns true if the random chance rolls 0 out of a specified Maximum range
 */
export interface RandomChanceFilter extends BaseFilter {
  /**
   * The maximum range for the random chance
   */
  value: number;
}
