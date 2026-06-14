import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in an area that has high humidity
 */
export interface IsHumidFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
