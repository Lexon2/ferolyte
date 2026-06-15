import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { LeapAtTargetBehavior } from '../../interfaces/behaviors/leap-at-target-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a LeapAtTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertLeapAtTargetBehavior = (
  behavior: Partial<LeapAtTargetBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.leap_at_target': any } | undefined => {
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

  // Validate mustBeOnGround
  if (behavior.mustBeOnGround !== undefined) {
    if (!validateBoolean(behavior.mustBeOnGround, 'mustBeOnGround')) {
      return undefined;
    }
    result.must_be_on_ground = behavior.mustBeOnGround;
  }

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate yd
  if (behavior.yd !== undefined) {
    if (!validateNumber(behavior.yd, 'yd')) {
      return undefined;
    }
    result.yd = behavior.yd;
  }

  // Validate targetDist
  if (behavior.targetDist !== undefined) {
    if (!validateNumber(behavior.targetDist, 'targetDist')) {
      return undefined;
    }
    result.target_dist = behavior.targetDist;
  }

  return {
    'minecraft:behavior.leap_at_target': result,
  };
};
