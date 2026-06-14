import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is navigating
 */
export interface IsNavigatingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
