import { ItemWearableSlot } from '../../types/item-wearable-slot';

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
): { 'minecraft:wearable': any } | undefined => {
  if (!options) {
    // Empty component is valid for wearable
    return undefined;
  }

  const result: any = {};

  if (options.slot !== undefined) {
    const validSlots: Set<ItemWearableSlot> = new Set([
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
    ]);

    if (!validSlots.has(options.slot)) {
      // @TODO: Add error handling
      console.error('Slot must be a valid wearable slot');

      return undefined;
    }
    result.slot = options.slot;
  }

  if (options.protection !== undefined) {
    if (typeof options.protection !== 'number' || options.protection < 0) {
      // @TODO: Add error handling
      console.error('Protection must be a non-negative number');

      return undefined;
    }
    result.protection = options.protection;
  }

  if (options.dispensable !== undefined) {
    if (typeof options.dispensable !== 'boolean') {
      // @TODO: Add error handling
      console.error('Dispensable must be a boolean');

      return undefined;
    }
    result.dispensable = options.dispensable;
  }

  if (options.hidesPlayerLocation !== undefined) {
    if (typeof options.hidesPlayerLocation !== 'boolean') {
      console.error('Hides player location must be a boolean');

      return undefined;
    }
    result.hides_player_location = options.hidesPlayerLocation;
  }

  return {
    'minecraft:wearable': result,
  };
};
