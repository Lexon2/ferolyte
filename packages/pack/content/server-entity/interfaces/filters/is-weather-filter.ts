import { BaseFilter } from './base-filter';
import { WeatherType } from '../../constants/weather-type';

/**
 * Tests for the current weather state the entity is experiencing
 *
 * @deprecated Use {@link WeatherFilter} (`weather`) instead. This test is deprecated in the schema.
 */
export interface IsWeatherFilter extends BaseFilter {
  /**
   * The weather type to test
   */
  value: WeatherType;
}
