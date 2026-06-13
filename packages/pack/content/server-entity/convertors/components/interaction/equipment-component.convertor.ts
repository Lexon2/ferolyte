import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EQUIPMENT_SLOTS, EquipmentSlot } from '../../../constants/equipment-slots';
import { EquipmentComponent } from '../../../interfaces/components/interaction/equipment-component';
import { validateString } from '../../common/validation';

const validateSlotDropChance = (
  slotDropChance: {
    dropChance: number;
    slot: EquipmentSlot;
  }[],
  fieldName: string,
): boolean => {
  if (!Array.isArray(slotDropChance)) {
    console.error(`${fieldName} must be an array`);

    return false;
  }

  for (const slot of slotDropChance) {
    if (typeof slot.dropChance !== 'number' || slot.dropChance < 0 || slot.dropChance > 1) {
      console.error(`${fieldName}.dropChance must be a number between 0 and 1`);

      return false;
    }

    if (!EQUIPMENT_SLOTS.includes(slot.slot)) {
      console.error(`${fieldName}.slot must be a valid equipment slot`);

      return false;
    }
  }

  return true;
};

/**
 * Converts an EquipmentComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertEquipmentComponent = (
  component: Partial<EquipmentComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:equipment': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate table
  if (component.table !== undefined) {
    if (!validateString(component.table, 'table')) {
      return undefined;
    }
    result.table = component.table;
  }

  // Validate slots
  if (component.slotDropChance !== undefined) {
    if (!validateSlotDropChance(component.slotDropChance, 'slotDropChance')) {
      return undefined;
    }
    result.slot_drop_chance = component.slotDropChance;
  }

  return {
    'minecraft:equipment': result,
  };
};
