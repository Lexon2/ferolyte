import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is underground
 */
export interface IsUndergroundFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
