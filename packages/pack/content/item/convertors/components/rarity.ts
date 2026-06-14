import { ItemRarity } from '../../types/item-rarity';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_RARITIES: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic'];

/**
 * Creates a rarity component for Minecraft items
 * @param value The rarity value of the item
 * @returns The rarity component in Minecraft format or undefined if validation fails
 */
export const createRarity = (
  value?: ItemRarity,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:rarity': ItemRarity } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      value,
      VALID_RARITIES,
      ctx,
      'Rarity must be one of: common, uncommon, rare, epic',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:rarity': value,
  };
};
