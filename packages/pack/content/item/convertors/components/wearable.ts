import { ItemWearableSlot } from '../../types/item-wearable-slot';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateNonNegativeNumber,
} from '@artifex/common/content/validation/content-validation';

const VALID_SLOTS: ItemWearableSlot[] = [
  'none',
  'slot.weapon.mainhand',
  'slot.weapon.offhand',
  'slot.armor.head',
  'slot.armor.chest',
  'slot.armor.legs',
  'slot.armor.feet',
  'slot.hotbar',
  'slot.inventory',
  'slot.enderchest',
  'slot.saddle',
  'slot.armor',
  'slot.chest',
  'slot.equippable',
];

interface WearableOptions {
  protection?: number;
  dispensable?: boolean;
  slot?: ItemWearableSlot;
  hidesPlayerLocation?: boolean;
}

/**
 * Creates a wearable component for Minecraft items
 * @param options The wearable options
 * @returns The wearable component in Minecraft format or undefined if validation fails
 */
export const createWearable = (
  options?: WearableOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:wearable': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.slot !== undefined) {
    if (
      !validateAllowedValue(
        options.slot,
        VALID_SLOTS,
        ctx,
        'Slot must be a valid wearable slot',
        'slot',
      )
    ) {
      return undefined;
    }
    result.slot = options.slot;
  }

  if (options.protection !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.protection,
        ctx,
        'Protection must be a non-negative number',
        'protection',
      )
    ) {
      return undefined;
    }
    result.protection = options.protection;
  }

  if (options.dispensable !== undefined) {
    if (
      !validateBooleanValue(
        options.dispensable,
        ctx,
        'Dispensable must be a boolean',
        'dispensable',
      )
    ) {
      return undefined;
    }
    result.dispensable = options.dispensable;
  }

  if (options.hidesPlayerLocation !== undefined) {
    if (
      !validateBooleanValue(
        options.hidesPlayerLocation,
        ctx,
        'Hides player location must be a boolean',
        'hidesPlayerLocation',
      )
    ) {
      return undefined;
    }
    result.hides_player_location = options.hidesPlayerLocation;
  }

  return {
    'minecraft:wearable': result,
  };
};
