import { BaseFilter } from './base-filter';

/**
 * Returns true when the bool actor property matches the value provided
 */
export interface BoolPropertyFilter extends BaseFilter {
  /**
   * The property name to look for
   */
  domain: string;

  /**
   * The boolean value to test against
   * @default true
   */
  value?: boolean;
}
