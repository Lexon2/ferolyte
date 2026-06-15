import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FollowOwnerBehavior } from '../../interfaces/behaviors/follow-owner-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a FollowOwnerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowOwnerBehavior = (
  behavior: Partial<FollowOwnerBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.follow_owner': any } | undefined => {
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

  // Validate startDistance
  if (behavior.startDistance !== undefined) {
    if (!validateNumber(behavior.startDistance, 'startDistance')) {
      return undefined;
    }
    result.start_distance = behavior.startDistance;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
  }

  // Validate postTeleportDistance
  if (behavior.postTeleportDistance !== undefined) {
    if (
      !validateNumber(behavior.postTeleportDistance, 'postTeleportDistance')
    ) {
      return undefined;
    }
    result.post_teleport_distance = behavior.postTeleportDistance;
  }

  // Validate canTeleport
  if (behavior.canTeleport !== undefined) {
    if (!validateBoolean(behavior.canTeleport, 'canTeleport')) {
      return undefined;
    }
    result.can_teleport = behavior.canTeleport;
  }

  // Validate ignoreVibration
  if (behavior.ignoreVibration !== undefined) {
    if (!validateBoolean(behavior.ignoreVibration, 'ignoreVibration')) {
      return undefined;
    }
    result.ignore_vibration = behavior.ignoreVibration;
  }

  // Validate maxDistance
  if (behavior.maxDistance !== undefined) {
    if (!validateNumber(behavior.maxDistance, 'maxDistance')) {
      return undefined;
    }
    result.max_distance = behavior.maxDistance;
  }

  return {
    'minecraft:behavior.follow_owner': result,
  };
};
