import { BaseFilter } from './base-filter';
import { DamageType } from '../../constants/damage-types';

/**
 * Returns true when the subject entity receives the named damage type
 */
export interface HasDamageFilter extends BaseFilter {
  /**
   * The damage type to test
   */
  value: DamageType;
}
