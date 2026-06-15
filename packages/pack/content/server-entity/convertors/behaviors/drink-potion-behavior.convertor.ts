import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DrinkPotionBehavior } from '../../interfaces/behaviors/drink-potion-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber, validatePercentage } from '../common/validation';

/**
 * Converts a DrinkPotionBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDrinkPotionBehavior = (
  behavior: Partial<DrinkPotionBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.drink_potion': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate speedModifier
  if (behavior.speedModifier !== undefined) {
    if (!validateNumber(behavior.speedModifier, 'speedModifier')) {
      return undefined;
    }
    result.speed_modifier = behavior.speedModifier;
  }

  // Validate potions
  if (behavior.potions !== undefined) {
    if (!Array.isArray(behavior.potions)) {
      console.error('potions must be an array');

      return undefined;
    }

    result.potions = behavior.potions.map((potion, index) => {
      const potionCtx = withFieldPath(ctx, `potions[${index}]`);
      const convertedPotion: any = {};

      // Validate id
      if (potion.id !== undefined) {
        if (!validateNumber(potion.id, 'id')) {
          return undefined;
        }
        convertedPotion.id = potion.id;
      }

      // Validate chance
      if (potion.chance !== undefined) {
        if (!validatePercentage(potion.chance, 'chance')) {
          return undefined;
        }
        convertedPotion.chance = potion.chance;
      }

      // Validate filters
      if (potion.filters !== undefined) {
        const convertedFilters = convertEntityFilters(
          potion.filters,
          withFieldPath(potionCtx, 'filters'),
        );
        if (convertedFilters === undefined) {
          return undefined;
        }
        convertedPotion.filters = convertedFilters;
      }

      return convertedPotion;
    });

    if (result.potions.some((potion: any) => potion === undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:behavior.drink_potion': result,
  };
};
