import { ItemEnchantableSlots } from '../../types/item-enchantable-slots';
import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateNonNegativeNumber,
} from '../../../../common/validation/content-validation';

const VALID_ENCHANTABLE_SLOTS: ItemEnchantableSlots[] = [
  'axe',
  'bow',
  'armor_feet',
  'armor_torso',
  'armor_head',
  'armor_legs',
  'hoe',
  'pickaxe',
  'shovel',
  'elytra',
  'fishing_rod',
  'flintsteel',
  'sword',
  'shears',
  'cosmetic_head',
];

interface EnchantableOptions {
  slot: ItemEnchantableSlots;
  value?: number;
}

/**
 * Creates an enchantable component for Minecraft items
 * @param options The enchantable options
 * @returns The enchantable component in Minecraft format or undefined if validation fails
 */
export const createEnchantable = (
  options?: EnchantableOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:enchantable': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      options.slot,
      VALID_ENCHANTABLE_SLOTS,
      ctx,
      'Enchantable slot is invalid',
      'slot',
    )
  ) {
    return undefined;
  }

  const result: any = {
    slot: options.slot,
  };

  if (options.value !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.value,
        ctx,
        'Enchantable value must be greater than or equal to 0',
        'value',
      )
    ) {
      return undefined;
    }
    result.value = options.value;
  }

  return {
    'minecraft:enchantable': result,
  };
};
