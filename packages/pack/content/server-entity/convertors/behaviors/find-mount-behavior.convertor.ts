import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FindMountBehavior } from '../../interfaces/behaviors/find-mount-behavior';
import { validateBoolean, validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a FindMountBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFindMountBehavior = (
  behavior: Partial<FindMountBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.find_mount': any } | undefined => {
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

  // Validate avoidWater
  if (behavior.avoidWater !== undefined) {
    if (typeof behavior.avoidWater !== 'boolean') {
      console.error('avoidWater must be a boolean');

      return undefined;
    }
    result.avoid_water = behavior.avoidWater;
  }

  // Validate mountDistance
  if (behavior.mountDistance !== undefined) {
    if (!validateNumber(behavior.mountDistance, 'mountDistance')) {
      return undefined;
    }
    result.mount_distance = behavior.mountDistance;
  }

  // Validate startDelay
  if (behavior.startDelay !== undefined) {
    if (!validateInteger(behavior.startDelay, 'startDelay')) {
      return undefined;
    }
    result.start_delay = behavior.startDelay;
  }

  // Validate targetNeeded
  if (behavior.targetNeeded !== undefined) {
    if (!validateBoolean(behavior.targetNeeded, 'targetNeeded')) {
      return undefined;
    }
    result.target_needed = behavior.targetNeeded;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  // Validate maxFailedAttempts
  if (behavior.maxFailedAttempts !== undefined) {
    if (!validateInteger(behavior.maxFailedAttempts, 'maxFailedAttempts')) {
      return undefined;
    }
    result.max_failed_attempts = behavior.maxFailedAttempts;
  }

  return {
    'minecraft:behavior.find_mount': result
  };
};
