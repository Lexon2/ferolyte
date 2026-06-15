import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { MoveTowardsTargetBehavior } from '../../interfaces/behaviors/move-towards-target-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveTowardsTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveTowardsTargetBehavior = (
  behavior: Partial<MoveTowardsTargetBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.move_towards_target': any } | undefined => {
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

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.move_towards_target': result,
  };
};
