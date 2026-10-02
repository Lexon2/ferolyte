import { RecipeBuilder } from './recipe-builder';
import type {
  BrewingContainerRecipeConfig,
  BrewingMixRecipeConfig,
  FurnaceRecipeConfig,
  RecipeConfig,
  ShapedRecipeConfig,
  ShapelessRecipeConfig,
  SmithingTransformRecipeConfig,
  SmithingTrimRecipeConfig,
} from './recipe-types';

/** Crafting table recipe with a pattern. */
export const shapedRecipe = (config: ShapedRecipeConfig): RecipeBuilder =>
  new RecipeBuilder({ type: 'shaped', ...config });

/** Crafting table recipe without a pattern. */
export const shapelessRecipe = (config: ShapelessRecipeConfig): RecipeBuilder =>
  new RecipeBuilder({ type: 'shapeless', ...config });

/** Furnace recipe (`tags` selects furnace, blast furnace, smoker, campfire, …). */
export const furnaceRecipe = (config: FurnaceRecipeConfig): RecipeBuilder =>
  new RecipeBuilder({ type: 'furnace', ...config });

/** Brewing stand recipe: potion + reagent → potion. */
export const brewingMixRecipe = (config: BrewingMixRecipeConfig): RecipeBuilder =>
  new RecipeBuilder({ type: 'brewingMix', ...config });

/** Brewing stand recipe that changes the container of a potion (e.g. splash). */
export const brewingContainerRecipe = (
  config: BrewingContainerRecipeConfig,
): RecipeBuilder => new RecipeBuilder({ type: 'brewingContainer', ...config });

export const smithingTransformRecipe = (
  config: SmithingTransformRecipeConfig,
): RecipeBuilder => new RecipeBuilder({ type: 'smithingTransform', ...config });

export const smithingTrimRecipe = (
  config: SmithingTrimRecipeConfig,
): RecipeBuilder => new RecipeBuilder({ type: 'smithingTrim', ...config });

/** Union dispatcher: `createRecipe({ type: 'shaped', ... })`. */
export const createRecipe = (config: RecipeConfig): RecipeBuilder =>
  new RecipeBuilder(config);
