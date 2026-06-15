import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FollowMobBehavior } from '../../interfaces/behaviors/follow-mob-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
  validateString,
} from '../common/validation';

/**
 * Converts a FollowMobBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowMobBehavior = (
  behavior: Partial<FollowMobBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.follow_mob': any } | undefined => {
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate preferredActorType
  if (behavior.preferredActorType !== undefined) {
    if (!validateString(behavior.preferredActorType, 'preferredActorType')) {
      return undefined;
    }
    result.preferred_actor_type = behavior.preferredActorType;
  }

  // Validate useHomePositionRestriction
  if (behavior.useHomePositionRestriction !== undefined) {
    if (
      !validateBoolean(
        behavior.useHomePositionRestriction,
        'useHomePositionRestriction',
      )
    ) {
      return undefined;
    }
    result.use_home_position_restriction = behavior.useHomePositionRestriction;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      behavior.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.follow_mob': result,
  };
};
