import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is inside a specified Block type
 */
export interface InBlockFilter extends BaseFilter {
  /**
   * A string value
   */
  value?: string;
}
