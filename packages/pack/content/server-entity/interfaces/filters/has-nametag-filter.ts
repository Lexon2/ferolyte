import { BaseFilter } from './base-filter';
import { EquipmentSlot } from '../../constants/equipment-slots';

/**
 * Tests for the presence of a named item in the designated slot of the subject entity
 */
export interface HasNametagFilter extends BaseFilter {
  /**
   * The equipment location to test
   * @default "any"
   */
  domain?: EquipmentSlot;

  /**
   * The nametag to look for
   */
  value: boolean;
}
