import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RollBehavior } from '../../interfaces/behaviors/roll-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RollBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRollBehavior = (
  behavior: Partial<RollBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.roll': any } | undefined => {
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

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  return {
    'minecraft:behavior.roll': result
  };
};
