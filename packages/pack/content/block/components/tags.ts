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
