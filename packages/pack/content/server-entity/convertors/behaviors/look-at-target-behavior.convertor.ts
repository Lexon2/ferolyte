import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { LookAtTargetBehavior } from '../../interfaces/behaviors/look-at-target-behavior';
import { convertRange } from '../common/convertors';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a LookAtTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertLookAtTargetBehavior = (
  behavior: Partial<LookAtTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.look_at_target': any } | undefined => {
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

  // Validate angleOfViewVertical
  if (behavior.angleOfViewVertical !== undefined) {
    if (!validateInteger(behavior.angleOfViewVertical, 'angleOfViewVertical')) {
      return undefined;
    }
    result.angle_of_view_vertical = behavior.angleOfViewVertical;
  }

  // Validate angleOfViewHorizontal
  if (behavior.angleOfViewHorizontal !== undefined) {
    if (!validateInteger(behavior.angleOfViewHorizontal, 'angleOfViewHorizontal')) {
      return undefined;
    }
    result.angle_of_view_horizontal = behavior.angleOfViewHorizontal;
  }

  // Validate lookDistance
  if (behavior.lookDistance !== undefined) {
    if (!validateNumber(behavior.lookDistance, 'lookDistance')) {
      return undefined;
    }
    result.look_distance = behavior.lookDistance;
  }

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  // Validate lookTime
  if (behavior.lookTime !== undefined) {
    const convertedLookTime = convertRange(behavior.lookTime, 'lookTime');
    if (!convertedLookTime) {
      return undefined;
    }
    result.look_time = convertedLookTime;
  }

  return {
    'minecraft:behavior.look_at_target': result
  };
};
