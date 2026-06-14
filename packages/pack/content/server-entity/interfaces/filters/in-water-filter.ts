import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in water
 */
export interface InWaterFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
