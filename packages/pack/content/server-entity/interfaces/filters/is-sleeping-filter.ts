import { BaseFilter } from './base-filter';

/**
 * Tests whether the subject is sleeping
 */
export interface IsSleepingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
