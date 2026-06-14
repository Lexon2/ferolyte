import { BaseFilter } from './base-filter';
import { FilterEquipmentSlot } from '../../constants/equipment-slots';

/**
 * Returns whether the subject entity has the same item equipped in the specified slot as the calling entity
 */
export interface HasSameEquipmentInSlotAsFilter extends BaseFilter {
  /**
   * The equipment location to test
   * @default "any"
   */
  domain?: FilterEquipmentSlot;

  /**
   * True or false
   * @default true
   */
  value?: boolean;
}
