import { BaseFilter } from './base-filter';

/**
 * Tests if the subject is sprinting
 */
export interface IsSprintingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
