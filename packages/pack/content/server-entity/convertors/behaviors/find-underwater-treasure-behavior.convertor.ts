import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FindUnderwaterTreasureBehavior } from '../../interfaces/behaviors/find-underwater-treasure-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a FindUnderwaterTreasureBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFindUnderwaterTreasureBehavior = (
  behavior: Partial<FindUnderwaterTreasureBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.find_underwater_treasure': any } | undefined => {
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

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
  }

  return {
    'minecraft:behavior.find_underwater_treasure': result,
  };
};
