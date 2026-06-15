import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  OnEquipmentChangedComponent,
  OnEquipmentChangedSlot,
} from '../../../interfaces/components/interaction/on-equipment-changed-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateInteger } from '../../common/validation';

const convertSlot = (
  slot: OnEquipmentChangedSlot,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): Record<string, unknown> | undefined => {
  const result: Record<string, unknown> = {};

  if (slot.slot !== undefined) {
    if (
      !validateInteger(
        slot.slot,
        `${fieldName}.slot`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.slot = slot.slot;
  }

  if (slot.onEquip !== undefined) {
    const converted = convertTrigger(
      slot.onEquip,
      withFieldPath(ctx, 'onEquip'),
    );
    if (!converted) {
      return undefined;
    }
    result.on_equip = converted;
  }

  if (slot.onUnequip !== undefined) {
    const converted = convertTrigger(
      slot.onUnequip,
      withFieldPath(ctx, 'onUnequip'),
    );
    if (!converted) {
      return undefined;
    }
    result.on_unequip = converted;
  }

  return result;
};

/**
 * Converts an OnEquipmentChangedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertOnEquipmentChangedComponent = (
  component: Partial<OnEquipmentChangedComponent>,
  ctx?: ContentDiagnosticContext,
):
  | { 'minecraft:on_equipment_changed': Record<string, unknown> }
  | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.slots !== undefined) {
    const slots = component.slots.map((slot, index) =>
      convertSlot(slot, `slots[${index}]`, ctx),
    );

    if (slots.some((slot) => slot === undefined)) {
      return undefined;
    }

    result.slots = slots;
  }

  return {
    'minecraft:on_equipment_changed': result,
  };
};
