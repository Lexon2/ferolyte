import { ItemTags } from '../../types/item-tags';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyArray } from '@ferolyte/common/content/validation/content-validation';

const VALID_TAGS = new Set<string>([
  'minecraft:arrow',
  'minecraft:banner',
  'minecraft:boat',
  'minecraft:boats',
  'minecraft:bookshelf_books',
  'minecraft:chainmail_tier',
  'minecraft:coals',
  'minecraft:crimson_stems',
  'minecraft:decorated_pot_sherds',
  'minecraft:diamond_tier',
  'minecraft:digger',
  'minecraft:door',
  'minecraft:golden_tier',
  'minecraft:hanging_actor',
  'minecraft:hanging_sign',
  'minecraft:horse_armor',
  'minecraft:iron_tier',
  'minecraft:is_armor',
  'minecraft:is_axe',
  'minecraft:is_cooked',
  'minecraft:is_fish',
  'minecraft:is_food',
  'minecraft:is_hoe',
  'minecraft:is_meat',
  'minecraft:is_minecart',
  'minecraft:is_pickaxe',
  'minecraft:is_shovel',
  'minecraft:is_sword',
  'minecraft:is_tool',
  'minecraft:is_trident',
  'minecraft:leather_tier',
  'minecraft:lectern_books',
  'minecraft:logs',
  'minecraft:logs_that_burn',
  'minecraft:mangrove_logs',
  'minecraft:music_disc',
  'minecraft:netherite_tier',
  'minecraft:planks',
  'minecraft:sand',
  'minecraft:sign',
  'minecraft:soul_fire_base_blocks',
  'minecraft:spawn_egg',
  'minecraft:stone_bricks',
  'minecraft:stone_crafting_materials',
  'minecraft:stone_tier',
  'minecraft:stone_tool_materials',
  'minecraft:transform_materials',
  'minecraft:transform_templates',
  'minecraft:transformable_items',
  'minecraft:trim_templates',
  'minecraft:trimmable_armors',
  'minecraft:vibration_damper',
  'minecraft:warped_stems',
  'minecraft:wooden_slabs',
  'minecraft:wooden_tier',
  'minecraft:wool',
]);

/**
 * Creates a tags component for Minecraft items
 * @param values Array of tag strings
 * @returns The tags component in Minecraft format or undefined if validation fails
 */
export const createTags = (
  values?: ItemTags[],
  ctx?: ContentDiagnosticContext,
): { 'minecraft:tags': { tags: string[] } } | undefined => {
  if (!validateNonEmptyArray(values, ctx, 'Tags must be a non-empty array')) {
    return undefined;
  }

  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (
      typeof value !== 'string' ||
      value.length === 0 ||
      !VALID_TAGS.has(value)
    ) {
      logContentError(
        ctx !== undefined ? { ...ctx, fieldPath: `[${index}]` } : undefined,
        'Tags must be non-empty strings',
      );
      return undefined;
    }
  }

  return {
    'minecraft:tags': {
      tags: values,
    },
  };
};
