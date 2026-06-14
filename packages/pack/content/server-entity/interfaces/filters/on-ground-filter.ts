import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is on ground
 */
export interface OnGroundFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
