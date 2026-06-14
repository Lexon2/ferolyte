import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is sitting
 */
export interface IsSittingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
