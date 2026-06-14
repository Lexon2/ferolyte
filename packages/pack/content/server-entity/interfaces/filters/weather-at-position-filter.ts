import { BaseFilter } from './base-filter';
import { WeatherType } from '../../constants/weather-type';

/**
 * Tests the current weather, at the actor's position, against a provided weather value
 */
export interface WeatherAtPositionFilter extends BaseFilter {
  /**
   * The weather type to test
   */
  value: WeatherType;
}
