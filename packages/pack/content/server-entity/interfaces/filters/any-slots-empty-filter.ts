import { BaseFilter } from './base-filter';
import { EquipmentLocation } from '../../constants/equipment-location';

/**
 * Returns true when the designated equipment location for the subject entity has any empty slot
 */
export interface AnySlotsEmptyFilter extends BaseFilter {
  /**
   * The equipment location to test
   */
  value: EquipmentLocation;
}
