import { BaseFilter } from './base-filter';
import { AbilityType } from '../../constants/ability-types';

/**
 * Returns true when the subject entity has the named ability
 */
export interface HasAbilityFilter extends BaseFilter {
  /**
   * The ability type to test
   */
  value: AbilityType;
}
