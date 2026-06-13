export const vanillaTags = [
  'diamond_tier_destructible',
  'iron_tier_destructible',
  'is_axe_item_destructible',
  'is_hoe_item_destructible',
  'is_mace_item_destructible',
  'is_pickaxe_item_destructible',
  'is_shears_item_destructible',
  'is_shovel_item_destructible',
  'is_sword_item_destructible',
  'netherite_tier_destructible',
  'stone_tier_destructible',
] as const;

export type BlockTags = (typeof vanillaTags)[number];

/**
 * Creates a tag component for Minecraft blocks
 * @param tags Array of block tags to apply
 * @returns The tag component in Minecraft format or undefined if validation fails
 */
export const createBlockTags = (
  tags?: string[],
): Record<string, object> | undefined => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return undefined;
  }

  const result: Record<string, object> = {};

  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.length === 0) {
      // @TODO: Add error handling
      console.error('Block tags must be non-empty strings');

      return undefined;
    }

    result[`tag:${tag}`] = {};
  }

  return result;
};
