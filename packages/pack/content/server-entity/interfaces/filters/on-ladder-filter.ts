import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is on a ladder
 */
export interface OnLadderFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
