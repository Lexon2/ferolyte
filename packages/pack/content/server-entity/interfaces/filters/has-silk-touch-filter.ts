import { BaseFilter } from './base-filter';

/**
 * Tests if the subject is holding an item with silk touch
 */
export interface HasSilkTouchFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
