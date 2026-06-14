import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is riding itself
 */
export interface IsRidingSelfFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
