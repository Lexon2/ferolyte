import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SwellBehavior } from '../../interfaces/behaviors/swell-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SwellBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwellBehavior = (
  behavior: Partial<SwellBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.swell': any } | undefined => {
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

  // Validate startDistance
  if (behavior.startDistance !== undefined) {
    if (!validateNumber(behavior.startDistance, 'startDistance')) {
      return undefined;
    }
    result.start_distance = behavior.startDistance;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
  }

  return {
    'minecraft:behavior.swell': result
  };
};
