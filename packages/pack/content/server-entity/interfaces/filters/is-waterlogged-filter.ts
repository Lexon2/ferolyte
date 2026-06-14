import { BaseFilter } from './base-filter';

/**
 * Tests if the subject block is submerged in water
 */
export interface IsWaterloggedFilter extends BaseFilter {
  /**
   * True or false
   */
  value: boolean;
}
