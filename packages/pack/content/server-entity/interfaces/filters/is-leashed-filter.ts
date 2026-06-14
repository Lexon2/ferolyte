import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is leashed
 */
export interface IsLeashedFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
