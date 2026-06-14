import { BaseFilter } from './base-filter';
import { EquipmentSlot } from '../../constants/equipment-slots';

/**
 * Tests for the presence of a damaged named item in the designated slot of the subject entity
 */
export interface HasDamagedEquipmentFilter extends BaseFilter {
  /**
   * The equipment location to test
   * @default "any"
   */
  domain?: EquipmentSlot;

  /**
   * The item name to look for
   */
  value: string;
}
