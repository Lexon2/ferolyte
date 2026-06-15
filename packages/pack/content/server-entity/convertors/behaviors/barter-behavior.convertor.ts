import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BarterBehavior } from '../../interfaces/behaviors/barter-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a BarterBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertBarterBehavior = (
  behavior: Partial<BarterBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.barter': any } | undefined => {
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

  return {
    'minecraft:behavior.barter': result,
  };
};
