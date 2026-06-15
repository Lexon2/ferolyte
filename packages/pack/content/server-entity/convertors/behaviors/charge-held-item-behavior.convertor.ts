import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ChargeHeldItemBehavior } from '../../interfaces/behaviors/charge-held-item-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a ChargeHeldItemBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertChargeHeldItemBehavior = (
  behavior: Partial<ChargeHeldItemBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.charge_held_item': any } | undefined => {
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
    if (
      !Array.isArray(behavior.items) ||
      !behavior.items.every((item) => typeof item === 'string')
    ) {
      console.error('items must be an array of strings');

      return undefined;
    }
    result.items = behavior.items;
  }

  return {
    'minecraft:behavior.charge_held_item': result,
  };
};
