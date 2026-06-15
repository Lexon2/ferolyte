import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DragonHoldingPatternBehavior } from '../../interfaces/behaviors/dragon-holding-pattern-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonHoldingPatternBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonHoldingPatternBehavior = (
  behavior: Partial<DragonHoldingPatternBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.dragonholdingpattern': any } | undefined => {
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
    'minecraft:behavior.dragonholdingpattern': result,
  };
};
