import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MoveOutdoorsBehavior } from '../../interfaces/behaviors/move-outdoors-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a MoveOutdoorsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveOutdoorsBehavior = (
  behavior: Partial<MoveOutdoorsBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_outdoors': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateInteger(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  return {
    'minecraft:behavior.move_outdoors': result
  };
};
