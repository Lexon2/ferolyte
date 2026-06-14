import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is holding a ranged weapon like a bow or crossbow
 */
export interface HasRangedWeaponFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
