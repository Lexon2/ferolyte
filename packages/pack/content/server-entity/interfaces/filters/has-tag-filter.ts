import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity has the tag provided
 */
export interface HasTagFilter extends BaseFilter {
  /**
   * The tag as a string
   */
  value: string;
}
