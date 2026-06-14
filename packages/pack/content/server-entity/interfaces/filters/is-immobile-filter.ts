import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is immobile
 */
export interface IsImmobileFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
