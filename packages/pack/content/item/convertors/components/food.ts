import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonEmptyString,
  validateNonNegativeNumber,
  validateNumber,
} from '@artifex/common/content/validation/content-validation';

interface FoodOptions {
  canAlwaysEat?: boolean;
  nutrition?: number;
  saturationModifier?: number;
  usingConvertsTo?: string;
}

/**
 * Creates a food component for Minecraft items
 * @param options The food options
 * @returns The food component in Minecraft format or undefined if validation fails
 */
export const createFood = (
  options?: FoodOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:food': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.nutrition !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.nutrition,
        ctx,
        'Nutrition must be a non-negative number',
        'nutrition',
      )
    ) {
      return undefined;
    }
    result.nutrition = options.nutrition;
  }

  if (options.saturationModifier !== undefined) {
    if (
      !validateNumber(
        options.saturationModifier,
        ctx,
        'Saturation modifier must be a number',
        'saturationModifier',
      )
    ) {
      return undefined;
    }
    result.saturation_modifier = options.saturationModifier;
  }

  if (options.canAlwaysEat !== undefined) {
    if (
      !validateBooleanValue(
        options.canAlwaysEat,
        ctx,
        'Can always eat must be a boolean',
        'canAlwaysEat',
      )
    ) {
      return undefined;
    }
    result.can_always_eat = options.canAlwaysEat;
  }

  if (options.usingConvertsTo !== undefined) {
    if (
      !validateNonEmptyString(
        options.usingConvertsTo,
        ctx,
        'Using converts to must be a non-empty string',
        'usingConvertsTo',
      )
    ) {
      return undefined;
    }
    result.using_converts_to = options.usingConvertsTo;
  }

  return {
    'minecraft:food': result,
  };
};
