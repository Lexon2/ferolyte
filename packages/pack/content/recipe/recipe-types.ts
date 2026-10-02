import type { LooseString } from '@ferolyte/common/types/core/loose-string';

/**
 * An item in a recipe. Shorthands:
 * - `'ns:item'` is `{ item: 'ns:item' }`
 * - `'ns:item:2'` is `{ item: 'ns:item', data: 2 }` (trailing number = data value)
 * - `{ tag: 'minecraft:planks' }` matches every item with the tag
 */
export type RecipeItem =
  | string
  | { item: string; data?: number; count?: number }
  | { tag: string };

/** Achievement context (`'AlwaysUnlocked'`, …), or the items whose possession unlocks the recipe. */
export type RecipeUnlock =
  | LooseString<'AlwaysUnlocked' | 'PlayerInWater' | 'PlayerHasManyItems'>
  | RecipeItem
  | RecipeItem[];

export interface RecipeBaseConfig {
  /** `namespace:name`, unique among recipes. */
  identifier: string;
  /** Crafting stations the recipe is available in. Defaults to the station of the recipe type. */
  tags?: LooseString<
    | 'crafting_table'
    | 'furnace'
    | 'blast_furnace'
    | 'smoker'
    | 'campfire'
    | 'soul_campfire'
    | 'brewing_stand'
    | 'smithing_table'
    | 'stonecutter'
  >[];
  unlock?: RecipeUnlock;
  /** Format version of the file. @default '1.20.10' */
  version?: string;
}

export interface ShapedRecipeConfig extends RecipeBaseConfig {
  /** Up to 3 rows of up to 3 symbols; a space is an empty slot. Every symbol must be defined in `key`. */
  pattern: string[];
  /** Single character → ingredient. */
  key: Record<string, RecipeItem>;
  result: RecipeItem | RecipeItem[];
  group?: string;
  priority?: number;
  assumeSymmetry?: boolean;
}

export interface ShapelessRecipeConfig extends RecipeBaseConfig {
  ingredients: RecipeItem[];
  result: RecipeItem | RecipeItem[];
  group?: string;
  priority?: number;
}

export interface FurnaceRecipeConfig extends RecipeBaseConfig {
  input: RecipeItem;
  output: RecipeItem;
  priority?: number;
}

export interface BrewingMixRecipeConfig extends RecipeBaseConfig {
  /** Potion item (kept as written: potion ids contain colons). */
  input: string;
  reagent: string;
  output: string;
}

export type BrewingContainerRecipeConfig = BrewingMixRecipeConfig;

export interface SmithingTransformRecipeConfig extends RecipeBaseConfig {
  template: RecipeItem;
  base: RecipeItem;
  addition: RecipeItem;
  result: RecipeItem | RecipeItem[];
}

export interface SmithingTrimRecipeConfig extends RecipeBaseConfig {
  template: RecipeItem;
  base: RecipeItem;
  addition: RecipeItem;
}

export type RecipeConfig =
  | ({ type: 'shaped' } & ShapedRecipeConfig)
  | ({ type: 'shapeless' } & ShapelessRecipeConfig)
  | ({ type: 'furnace' } & FurnaceRecipeConfig)
  | ({ type: 'brewingMix' } & BrewingMixRecipeConfig)
  | ({ type: 'brewingContainer' } & BrewingContainerRecipeConfig)
  | ({ type: 'smithingTransform' } & SmithingTransformRecipeConfig)
  | ({ type: 'smithingTrim' } & SmithingTrimRecipeConfig);

export type RecipeType = RecipeConfig['type'];
