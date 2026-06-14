import { BaseFilter } from './base-filter';

/**
 * Returns true when the enum actor property matches the value provided
 */
export interface EnumPropertyFilter extends BaseFilter {
  /**
   * The property name to look for
   */
  domain: string;

  /**
   * The string value to test against
   */
  value: string;
}
