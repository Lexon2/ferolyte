import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject is trusted by entity
 */
export interface TrustsFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
