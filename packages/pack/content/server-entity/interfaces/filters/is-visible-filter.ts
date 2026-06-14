import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is visible
 */
export interface IsVisibleFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
