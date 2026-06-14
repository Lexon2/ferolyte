import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RandomLookAroundAndSitBehavior } from '../../interfaces/behaviors/random-look-around-and-sit-behavior';
import { validateNumber, validateBoolean, validateDegrees, validateInteger } from '../common/validation';

/**
 * Converts a RandomLookAroundAndSitBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomLookAroundAndSitBehavior = (
  behavior: Partial<RandomLookAroundAndSitBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.random_look_around_and_sit': any } | undefined => {
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

  // Validate continueIfLeashed
  if (behavior.continueIfLeashed !== undefined) {
    if (!validateBoolean(behavior.continueIfLeashed, 'continueIfLeashed')) {
      return undefined;
    }
    result.continue_if_leashed = behavior.continueIfLeashed;
  }

  // Validate continueSittingOnReload
  if (behavior.continueSittingOnReload !== undefined) {
    if (!validateBoolean(behavior.continueSittingOnReload, 'continueSittingOnReload')) {
      return undefined;
    }
    result.continue_sitting_on_reload = behavior.continueSittingOnReload;
  }

  // Validate maxAngleOfViewHorizontal
  if (behavior.maxAngleOfViewHorizontal !== undefined) {
    if (!validateDegrees(behavior.maxAngleOfViewHorizontal, 'maxAngleOfViewHorizontal')) {
      return undefined;
    }
    result.max_angle_of_view_horizontal = behavior.maxAngleOfViewHorizontal;
  }

  // Validate maxLookCount
  if (behavior.maxLookCount !== undefined) {
    if (!validateInteger(behavior.maxLookCount, 'maxLookCount')) {
      return undefined;
    }
    result.max_look_count = behavior.maxLookCount;
  }

  // Validate maxLookTime
  if (behavior.maxLookTime !== undefined) {
    if (!validateNumber(behavior.maxLookTime, 'maxLookTime')) {
      return undefined;
    }
    result.max_look_time = behavior.maxLookTime;
  }

  // Validate minAngleOfViewHorizontal
  if (behavior.minAngleOfViewHorizontal !== undefined) {
    if (!validateDegrees(behavior.minAngleOfViewHorizontal, 'minAngleOfViewHorizontal', true)) {
      return undefined;
    }
    result.min_angle_of_view_horizontal = behavior.minAngleOfViewHorizontal;
  }

  // Validate minLookCount
  if (behavior.minLookCount !== undefined) {
    if (!validateInteger(behavior.minLookCount, 'minLookCount')) {
      return undefined;
    }
    result.min_look_count = behavior.minLookCount;
  }

  // Validate minLookTime
  if (behavior.minLookTime !== undefined) {
    if (!validateInteger(behavior.minLookTime, 'minLookTime')) {
      return undefined;
    }
    result.min_look_time = behavior.minLookTime;
  }

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  // Validate randomLookAroundCooldown
  if (behavior.randomLookAroundCooldown !== undefined) {
    if (!validateInteger(behavior.randomLookAroundCooldown, 'randomLookAroundCooldown')) {
      return undefined;
    }
    result.random_look_around_cooldown = behavior.randomLookAroundCooldown;
  }

  return {
    'minecraft:behavior.random_look_around_and_sit': result
  };
};
