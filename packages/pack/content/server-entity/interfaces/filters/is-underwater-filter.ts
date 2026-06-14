import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is under water
 */
export interface IsUnderwaterFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
