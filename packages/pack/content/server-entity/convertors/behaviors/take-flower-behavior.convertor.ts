import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TakeFlowerBehavior } from '../../interfaces/behaviors/take-flower-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber, validateVector3 } from '../common/validation';

/**
 * Converts a TakeFlowerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTakeFlowerBehavior = (
  behavior: Partial<TakeFlowerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.take_flower': any } | undefined => {
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

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate maxHeadRotationY
  if (behavior.maxHeadRotationY !== undefined) {
    if (!validateNumber(behavior.maxHeadRotationY, 'maxHeadRotationY')) {
      return undefined;
    }
    result.max_head_rotation_y = behavior.maxHeadRotationY;
  }

  // Validate maxRotationX
  if (behavior.maxRotationX !== undefined) {
    if (!validateNumber(behavior.maxRotationX, 'maxRotationX')) {
      return undefined;
    }
    result.max_rotation_x = behavior.maxRotationX;
  }

  // Validate maxWaitTime
  if (behavior.maxWaitTime !== undefined) {
    if (!validateNumber(behavior.maxWaitTime, 'maxWaitTime')) {
      return undefined;
    }
    result.max_wait_time = behavior.maxWaitTime;
  }

  // Validate minDistanceToTarget
  if (behavior.minDistanceToTarget !== undefined) {
    if (!validateNumber(behavior.minDistanceToTarget, 'minDistanceToTarget')) {
      return undefined;
    }
    result.min_distance_to_target = behavior.minDistanceToTarget;
  }

  // Validate minWaitTime
  if (behavior.minWaitTime !== undefined) {
    if (!validateNumber(behavior.minWaitTime, 'minWaitTime')) {
      return undefined;
    }
    result.min_wait_time = behavior.minWaitTime;
  }

  // Validate searchArea
  if (behavior.searchArea !== undefined) {
    if (!validateVector3(behavior.searchArea, 'searchArea')) {
      return undefined;
    }
    result.search_area = behavior.searchArea;
  }

  return {
    'minecraft:behavior.take_flower': result
  };
};
