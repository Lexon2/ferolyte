import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity in contact with any water: water, rain, splash water bottle
 */
export interface InContactWithWaterFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
