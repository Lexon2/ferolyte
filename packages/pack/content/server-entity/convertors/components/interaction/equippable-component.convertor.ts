import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EquippableComponent, EquippableSlot } from '../../../interfaces/components/interaction/equippable-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates an equippable slot
 * @param slot The slot to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the slot is valid
 */
const validateEquippableSlot = (
  slot: EquippableSlot,
  fieldName: string,
): boolean => {
  if (slot.slot !== undefined) {
    if (!validateNumber(slot.slot, `${fieldName}.slot`, 0, Number.MAX_VALUE)) {
      return false;
    }
  }

  if (slot.item !== undefined) {
    if (!validateString(slot.item, `${fieldName}.item`)) {
      return false;
    }
  }

  if (slot.interactText !== undefined) {
    if (!validateString(slot.interactText, `${fieldName}.interactText`)) {
      return false;
    }
  }

  // onEquip and onUnequip are Trigger types that are validated elsewhere
  return true;
};

/**
 * Converts an EquippableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertEquippableComponent = (
  component: Partial<EquippableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:equippable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate slots
  if (component.slots !== undefined) {
    if (!Array.isArray(component.slots)) {
      console.error('slots must be an array');

      return undefined;
    }

    const validatedSlots = component.slots.map((slot, index) => {
      if (!validateEquippableSlot(slot, `slots[${index}]`)) {
        return undefined;
      }

      const validatedSlot: any = {};
      if (slot.slot !== undefined) {
        validatedSlot.slot = slot.slot;
      }
      if (slot.item !== undefined) {
        validatedSlot.item = slot.item;
      }
      if (slot.interactText !== undefined) {
        validatedSlot.interact_text = slot.interactText;
      }

      if (slot.onEquip !== undefined) {
        const convertedOnEquip = convertTrigger(slot.onEquip, withFieldPath(ctx, 'onEquip'));
        if (!convertedOnEquip) {
          return undefined;
        }
        validatedSlot.on_equip = convertedOnEquip;
      }
      if (slot.onUnequip !== undefined) {
        const convertedOnUnequip = convertTrigger(slot.onUnequip, withFieldPath(ctx, 'onUnequip'));
        if (!convertedOnUnequip) {
          return undefined;
        }
        validatedSlot.on_unequip = convertedOnUnequip;
      }
      return validatedSlot;
    });

    if (validatedSlots.includes(undefined)) {
      return undefined;
    }

    result.slots = validatedSlots;
  }

  return {
    'minecraft:equippable': result,
  };
};
