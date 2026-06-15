import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { MoveToVillageBehavior } from '../../interfaces/behaviors/move-to-village-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a MoveToVillageBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveToVillageBehavior = (
  behavior: Partial<MoveToVillageBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.move_to_village': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  return {
    'minecraft:behavior.move_to_village': result,
  };
};
