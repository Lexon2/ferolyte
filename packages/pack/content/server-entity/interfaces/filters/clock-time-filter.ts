import { BaseFilter } from './base-filter';

/**
 * Compares the current time with a float value in the range (0.0, 1.0)
 * 0.0= Noon
 * 0.25= Sunset
 * 0.5= Midnight
 * 0.75= Sunrise
 */
export interface ClockTimeFilter extends BaseFilter {
  /**
   * The time value to test against
   */
  value: number;
}
