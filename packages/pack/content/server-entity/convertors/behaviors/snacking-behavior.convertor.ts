import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SnackingBehavior } from '../../interfaces/behaviors/snacking-behavior';
import { validateNumber, validatePercentage, validateStringArray } from '../common/validation';

/**
 * Converts a SnackingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSnackingBehavior = (
  behavior: Partial<SnackingBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.snacking': any } | undefined => {
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

  // Validate items
  if (behavior.items !== undefined) {
    if (!validateStringArray(behavior.items, 'items')) {
      return undefined;
    }
    result.items = behavior.items;
  }

  // Validate snackingCooldown
  if (behavior.snackingCooldown !== undefined) {
    if (!validateNumber(behavior.snackingCooldown, 'snackingCooldown')) {
      return undefined;
    }
    result.snacking_cooldown = behavior.snackingCooldown;
  }

  // Validate snackingCooldownMin
  if (behavior.snackingCooldownMin !== undefined) {
    if (!validateNumber(behavior.snackingCooldownMin, 'snackingCooldownMin')) {
      return undefined;
    }
    result.snacking_cooldown_min = behavior.snackingCooldownMin;
  }

  // Validate snackingStopChance
  if (behavior.snackingStopChance !== undefined) {
    if (!validatePercentage(behavior.snackingStopChance, 'snackingStopChance')) {
      return undefined;
    }
    result.snacking_stop_chance = behavior.snackingStopChance;
  }

  return {
    'minecraft:behavior.snacking': result
  };
};
