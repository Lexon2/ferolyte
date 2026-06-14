import { BaseFilter } from './base-filter';
import { Color } from '../../constants/colors';


/**
 * Returns true when the subject entity is the given color
 */
export interface IsColorFilter extends BaseFilter {
  /**
   * The Color to test
   */
  value: Color;
}
