import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BreakDoorBehavior } from '../../interfaces/behaviors/break-door-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a BreakDoorBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertBreakDoorBehavior = (
  behavior: Partial<BreakDoorBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.break_door': any } | undefined => {
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

  return {
    'minecraft:behavior.break_door': result,
  };
};
