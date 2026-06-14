import { BaseFilter } from './base-filter';

/**
 * Compares the current 24 hour time with an int value in the range [0, 24000]
 */
export interface HourlyClockTimeFilter extends BaseFilter {
  /**
   * An integer value set between 0 and 24000
   */
  value: number;
}
