import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is holding an item with the specified component
 */
export interface HasItemWithComponentFilter extends BaseFilter {
  /**
   * The component name to look for
   */
  value: string;
}
