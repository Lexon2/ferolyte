import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RoarBehavior } from '../../interfaces/behaviors/roar-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RoarBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRoarBehavior = (
  behavior: Partial<RoarBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.roar': any } | undefined => {
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

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  return {
    'minecraft:behavior.roar': result
  };
};
