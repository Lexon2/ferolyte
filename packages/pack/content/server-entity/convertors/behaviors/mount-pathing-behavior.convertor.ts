import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { MountPathingBehavior } from '../../interfaces/behaviors/mount-pathing-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a MountPathingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMountPathingBehavior = (
  behavior: Partial<MountPathingBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.mount_pathing': any } | undefined => {
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

  // Validate targetDistance
  if (behavior.targetDistance !== undefined) {
    if (!validateNumber(behavior.targetDistance, 'targetDistance')) {
      return undefined;
    }
    result.target_distance = behavior.targetDistance;
  }

  // Validate trackTarget
  if (behavior.trackTarget !== undefined) {
    if (!validateBoolean(behavior.trackTarget, 'trackTarget')) {
      return undefined;
    }
    result.track_target = behavior.trackTarget;
  }

  return {
    'minecraft:behavior.mount_pathing': result,
  };
};
