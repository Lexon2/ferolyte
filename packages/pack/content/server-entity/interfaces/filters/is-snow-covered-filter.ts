import { BaseFilter } from './base-filter';

/**
 * Tests whether the subject is in an area with snow cover
 */
export interface IsSnowCoveredFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
