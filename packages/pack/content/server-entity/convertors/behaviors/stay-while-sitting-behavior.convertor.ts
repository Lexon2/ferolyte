import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { StayWhileSittingBehavior } from '../../interfaces/behaviors/stay-while-sitting-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a StayWhileSittingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStayWhileSittingBehavior = (
  behavior: Partial<StayWhileSittingBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.stay_while_sitting': any } | undefined => {
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
    'minecraft:behavior.stay_while_sitting': result,
  };
};
