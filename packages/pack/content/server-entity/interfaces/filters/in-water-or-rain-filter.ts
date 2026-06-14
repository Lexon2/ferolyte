import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in water or rain
 */
export interface InWaterOrRainFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
