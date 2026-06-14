import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FollowTargetLeaderBehavior } from '../../interfaces/behaviors/follow-target-leader-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
} from '../common/validation';

/**
 * Converts a FollowTargetLeaderBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowTargetLeaderBehavior = (
  behavior: Partial<FollowTargetLeaderBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.follow_target_leader': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority', 0, undefined, ctx)) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  if (behavior.alwaysLookForLeader !== undefined) {
    if (!validateBoolean(behavior.alwaysLookForLeader, 'alwaysLookForLeader', ctx)) {
      return undefined;
    }
    result.always_look_for_leader = behavior.alwaysLookForLeader;
  }

  if (behavior.followDistance !== undefined) {
    if (!validateNumber(behavior.followDistance, 'followDistance', undefined, undefined, ctx)) {
      return undefined;
    }
    result.follow_distance = behavior.followDistance;
  }

  if (behavior.leaderFilters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.leaderFilters, withFieldPath(ctx, 'leaderFilters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.leader_filters = convertedFilters;
  }

  if (behavior.searchCooldown !== undefined) {
    if (!validateInteger(behavior.searchCooldown, 'searchCooldown', 0, undefined, ctx)) {
      return undefined;
    }
    result.search_cooldown = behavior.searchCooldown;
  }

  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius', undefined, undefined, ctx)) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.follow_target_leader': result,
  };
};
