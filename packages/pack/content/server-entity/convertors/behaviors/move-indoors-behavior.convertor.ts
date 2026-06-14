import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MoveIndoorsBehavior } from '../../interfaces/behaviors/move-indoors-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveIndoorsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveIndoorsBehavior = (
  behavior: Partial<MoveIndoorsBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_indoors': any } | undefined => {
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate timeout
  if (behavior.timeout !== undefined) {
    if (!validateNumber(behavior.timeout, 'timeout')) {
      return undefined;
    }
    result.timeout = behavior.timeout;
  }

  return {
    'minecraft:behavior.move_indoors': result
  };
};
