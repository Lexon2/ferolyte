import { BaseFilter } from './base-filter';

/**
 * Tests if the subject's persistence matches the bool value passed in
 */
export interface IsPersistentFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
