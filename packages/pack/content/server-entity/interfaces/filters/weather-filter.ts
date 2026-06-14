import { BaseFilter } from './base-filter';
import { WeatherType } from '../../constants/weather-type';

/**
 * Tests for the current weather state the entity is experiencing
 */
export interface WeatherFilter extends BaseFilter {
  /**
   * The weather type to test
   */
  value: WeatherType;
}
