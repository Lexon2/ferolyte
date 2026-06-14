import { BaseFilter } from './base-filter';

/**
 * Returns true when the brightness matches the given value
 */
export interface IsBrightnessFilter extends BaseFilter {
  /**
   * The brightness value to compare with
   */
  value: number;
}
