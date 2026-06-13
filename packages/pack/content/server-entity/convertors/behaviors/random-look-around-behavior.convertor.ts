import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RandomLookAroundBehavior } from '../../interfaces/behaviors/random-look-around-behavior';
import { convertRange } from '../common/convertors';
import { validateDegrees, validateNumber } from '../common/validation';

/**
 * Converts a RandomLookAroundBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomLookAroundBehavior = (
  behavior: Partial<RandomLookAroundBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.random_look_around': any } | undefined => {
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

  // Validate angleOfViewHorizontal
  if (behavior.angleOfViewHorizontal !== undefined) {
    if (!validateDegrees(behavior.angleOfViewHorizontal, 'angleOfViewHorizontal')) {
      return undefined;
    }
    result.angle_of_view_horizontal = behavior.angleOfViewHorizontal;
  }

  // Validate angleOfViewVertical
  if (behavior.angleOfViewVertical !== undefined) {
    if (!validateDegrees(behavior.angleOfViewVertical, 'angleOfViewVertical')) {
      return undefined;
    }
    result.angle_of_view_vertical = behavior.angleOfViewVertical;
  }

  // Validate lookDistance
  if (behavior.lookDistance !== undefined) {
    if (!validateNumber(behavior.lookDistance, 'lookDistance')) {
      return undefined;
    }
    result.look_distance = behavior.lookDistance;
  }

  // Validate lookTime
  if (behavior.lookTime !== undefined) {
    const convertedLookTime = convertRange(behavior.lookTime, 'lookTime');
    if (!convertedLookTime) {
      return undefined;
    }
    result.look_time = convertedLookTime;
  }

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  return {
    'minecraft:behavior.random_look_around': result
  };
};
