import { BaseFilter } from './base-filter';

/**
 * Returns true when the integer actor property matches the value provided
 */
export interface IntPropertyFilter extends BaseFilter {
  /**
   * The property name to look for
   */
  domain: string;

  /**
   * An integer value
   */
  value: number;
}
