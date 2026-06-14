import { BaseFilter } from './base-filter';
import { EquipmentLocation } from '../../constants/equipment-location';

/**
 * Returns true when the designated equipment location for the subject entity is completely empty
 */
export interface AllSlotsEmptyFilter extends BaseFilter {
  /**
   * The equipment location to test
   */
  value: EquipmentLocation;
}
