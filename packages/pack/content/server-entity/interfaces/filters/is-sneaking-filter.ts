import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is sneaking
 */
export interface IsSneakingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
