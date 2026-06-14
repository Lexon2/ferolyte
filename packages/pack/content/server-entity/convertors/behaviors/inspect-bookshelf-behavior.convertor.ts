import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { InspectBookshelfBehavior } from '../../interfaces/behaviors/inspect-bookshelf-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts an InspectBookshelfBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertInspectBookshelfBehavior = (
  behavior: Partial<InspectBookshelfBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.inspect_bookshelf': any } | undefined => {
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

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  return {
    'minecraft:behavior.inspect_bookshelf': result,
  };
};
