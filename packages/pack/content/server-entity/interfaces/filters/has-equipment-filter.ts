import { BaseFilter } from './base-filter';
import { FilterEquipmentSlot } from '../../constants/equipment-slots';

/**
 * Tests for the presence of a named item in the designated slot of the subject entity
 */
export interface HasEquipmentFilter extends BaseFilter {
  /**
   * The equipment location to test
   * @default "any"
   */
  domain?: FilterEquipmentSlot;

  /**
   * The item name to look for
   */
  value: string;
}
