import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SlimeRandomDirectionBehavior } from '../../interfaces/behaviors/slime-random-direction-behavior';
import {
  validateDegrees,
  validateInteger,
  validateNumber,
} from '../common/validation';

/**
 * Converts a SlimeRandomDirectionBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSlimeRandomDirectionBehavior = (
  behavior: Partial<SlimeRandomDirectionBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.slime_random_direction': any } | undefined => {
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

  // Validate addRandomTimeRange
  if (behavior.addRandomTimeRange !== undefined) {
    if (!validateInteger(behavior.addRandomTimeRange, 'addRandomTimeRange')) {
      return undefined;
    }
    result.add_random_time_range = behavior.addRandomTimeRange;
  }

  // Validate minChangeDirectionTime
  if (behavior.minChangeDirectionTime !== undefined) {
    if (
      !validateNumber(behavior.minChangeDirectionTime, 'minChangeDirectionTime')
    ) {
      return undefined;
    }
    result.min_change_direction_time = behavior.minChangeDirectionTime;
  }

  // Validate turnRange
  if (behavior.turnRange !== undefined) {
    if (!validateDegrees(behavior.turnRange, 'turnRange', true)) {
      return undefined;
    }
    result.turn_range = behavior.turnRange;
  }

  return {
    'minecraft:behavior.slime_random_direction': result,
  };
};
