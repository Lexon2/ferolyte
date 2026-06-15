import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DrinkMilkBehavior } from '../../interfaces/behaviors/drink-milk-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a DrinkMilkBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDrinkMilkBehavior = (
  behavior: Partial<DrinkMilkBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.drink_milk': any } | undefined => {
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

  // Validate cooldownSeconds
  if (behavior.cooldownSeconds !== undefined) {
    if (!validateNumber(behavior.cooldownSeconds, 'cooldownSeconds')) {
      return undefined;
    }
    result.cooldown_seconds = behavior.cooldownSeconds;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      behavior.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (convertedFilters === undefined) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.drink_milk': result,
  };
};
