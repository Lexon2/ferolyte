import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyArray } from '@artifex/common/content/validation/content-validation';

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
  ctx?: ContentDiagnosticContext,
): Record<string, object> | undefined => {
  if (!validateNonEmptyArray(tags, ctx, 'Block tags must be a non-empty array')) {
    return undefined;
  }

  const result: Record<string, object> = {};

  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    if (typeof tag !== 'string' || tag.length === 0) {
      logContentError(
        ctx !== undefined ? { ...ctx, fieldPath: `[${index}]` } : undefined,
        'Block tags must be non-empty strings',
      );
      return undefined;
    }

    result[`tag:${tag}`] = {};
  }

  return result;
};
