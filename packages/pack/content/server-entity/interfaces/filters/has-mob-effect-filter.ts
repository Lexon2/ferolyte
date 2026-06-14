import { BaseFilter } from './base-filter';

/**
 * Tests whether the Subject has the specified mob effect
 */
export interface HasMobEffectFilter extends BaseFilter {
  /**
   * The specified mob effect
   */
  value: string;
}
