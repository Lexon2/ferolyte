import { BaseFilter } from './base-filter';

/**
 * Returns true when the block has the given name
 */
export interface IsBlockFilter extends BaseFilter {
  /**
   * The block name to look for
   */
  value: string;
}
