import { BaseFilter } from './base-filter';

/**
 * Tests if the subject is taking fire damage
 */
export interface TakingFireDamageFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
