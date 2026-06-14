import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is climbing
 */
export interface IsClimbingFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
