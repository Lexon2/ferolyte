import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { MakeLoveBehavior } from '../../interfaces/behaviors/make-love-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MakeLoveBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMakeLoveBehavior = (
  behavior: Partial<MakeLoveBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.make_love': any } | undefined => {
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
    'minecraft:behavior.make_love': result,
  };
};
