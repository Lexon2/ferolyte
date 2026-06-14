import { BaseFilter } from './base-filter';

/**
 * Tests if the mob is outside of the specified light level range (0, 16)
 */
export interface LightLevelFilter extends BaseFilter {
  /**
   * The light level value to compare with
   * @minimum 0
   * @maximum 16
   */
  value: number;
}
