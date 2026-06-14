import { BaseFilter } from './base-filter';

/**
 * Tests whether the target has any trade supply left
 */
export interface HasTradeSupplyFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
