import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is in a caravan
 */
export interface InCaravanFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
