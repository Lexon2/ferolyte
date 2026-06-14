import { BaseFilter } from './base-filter';

/**
 * Returns the number of riders on this entity
 */
export interface RiderCountFilter extends BaseFilter {
  /**
   * The number of riders to compare with
   */
  value: number;
}
