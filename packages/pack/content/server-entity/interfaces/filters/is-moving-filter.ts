import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is moving
 */
export interface IsMovingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
