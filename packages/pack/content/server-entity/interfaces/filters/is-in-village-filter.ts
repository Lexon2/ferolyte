import { BaseFilter } from './base-filter';

/**
 * Tests whether the subject is inside the bounds of a village
 */
export interface IsInVillageFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
