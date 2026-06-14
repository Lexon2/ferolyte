import { BaseFilter } from './base-filter';

/**
 * Tests whether the subject is tamed
 */
export interface IsTamedFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
