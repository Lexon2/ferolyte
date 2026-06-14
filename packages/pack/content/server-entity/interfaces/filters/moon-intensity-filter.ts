import { BaseFilter } from './base-filter';

/**
 * Compares the current moon intensity with a float value in the range (0.0, 1.0)
 */
export interface MoonIntensityFilter extends BaseFilter {
  /**
   * The moon intensity value to compare with
   * @minimum 0.0
   * @maximum 1.0
   */
  value: number;
}
