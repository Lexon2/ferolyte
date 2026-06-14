import { BaseFilter } from './base-filter';

/**
 * Tests the current temperature against a provided value in the range (0.0, 1.0)
 * where 0.0f is the coldest temp and 1.0f is the hottest
 */
export interface IsTemperatureValueFilter extends BaseFilter {
  /**
   * The biome temperature value to compare with
   * @minimum 0.0
   * @maximum 1.0
   */
  value: number;
}
