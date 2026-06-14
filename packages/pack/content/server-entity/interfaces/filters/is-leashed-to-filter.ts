import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is leashed to the calling entity
 */
export interface IsLeashedToFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
