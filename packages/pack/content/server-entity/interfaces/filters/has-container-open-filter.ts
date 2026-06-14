import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject Player entity has opened a container
 */
export interface HasContainerOpenFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
