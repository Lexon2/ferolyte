import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FollowTargetCaptainBehavior } from '../../interfaces/behaviors/follow-target-captain-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a FollowTargetCaptainBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowTargetCaptainBehavior = (
  behavior: Partial<FollowTargetCaptainBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.follow_target_captain': any } | undefined => {
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

  // Validate followDistance
  if (behavior.followDistance !== undefined) {
    if (!validateNumber(behavior.followDistance, 'followDistance')) {
      return undefined;
    }
    result.follow_distance = behavior.followDistance;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.follow_target_captain': result
  };
};
