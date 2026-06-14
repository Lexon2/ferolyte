import { BaseFilter } from './base-filter';

/**
 * Returns true during the daylight hours
 */
export interface IsDaytimeFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
