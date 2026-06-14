import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity contains the named component
 */
export interface HasComponentFilter extends BaseFilter {
  /**
   * The component name to look for
   */
  value: string;
}
