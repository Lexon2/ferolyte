import { BaseFilter } from './base-filter';
import { TemperatureType } from '../../constants/temperature-types';

/**
 * Tests whether the current temperature is a given type
 */
export interface IsTemperatureTypeFilter extends BaseFilter {
  /**
   * The biome temperature category to test
   */
  value: TemperatureType;
}
