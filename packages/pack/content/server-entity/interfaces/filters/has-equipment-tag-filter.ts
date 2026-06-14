import { BaseFilter } from './base-filter';
import { EquipmentSlot } from '../../constants/equipment-slots';

/**
 * Tests for the presence of an item with the named tag in the designated slot of the subject entity
 */
export interface HasEquipmentTagFilter extends BaseFilter {
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
