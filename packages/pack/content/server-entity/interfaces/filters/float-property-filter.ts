import { BaseFilter } from './base-filter';

/**
 * Returns true when the float actor property matches the value provided
 */
export interface FloatPropertyFilter extends BaseFilter {
  /**
   * The property name to look for
   */
  domain: string;

  /**
   * The float value to test against
   */
  value: number;
}
