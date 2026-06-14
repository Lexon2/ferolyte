import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is riding on another entity
 */
export interface IsRidingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
