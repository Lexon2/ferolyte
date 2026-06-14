import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EatCarriedItemBehavior } from '../../interfaces/behaviors/eat-carried-item-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an EatCarriedItemBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEatCarriedItemBehavior = (
  behavior: Partial<EatCarriedItemBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.eat_carried_item': any } | undefined => {
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

  // Validate delayBeforeEating
  if (behavior.delayBeforeEating !== undefined) {
    if (!validateNumber(behavior.delayBeforeEating, 'delayBeforeEating')) {
      return undefined;
    }
    result.delay_before_eating = behavior.delayBeforeEating;
  }

  return {
    'minecraft:behavior.eat_carried_item': result
  };
};
