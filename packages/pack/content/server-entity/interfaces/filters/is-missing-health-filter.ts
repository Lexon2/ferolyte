import { BaseFilter } from './base-filter';

/**
 * Tests if the subject is not at full health
 */
export interface IsMissingHealthFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
