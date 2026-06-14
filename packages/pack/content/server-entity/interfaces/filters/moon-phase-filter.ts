import { BaseFilter } from './base-filter';

/**
 * Compares the current moon phase with an integer value in the range (0, 7)
 */
export interface MoonPhaseFilter extends BaseFilter {
  /**
   * The moon phase value to compare with
   * @minimum 0
   * @maximum 7
   */
  value: number;
}
