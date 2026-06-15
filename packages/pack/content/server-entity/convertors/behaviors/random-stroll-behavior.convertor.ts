import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { RandomStrollBehavior } from '../../interfaces/behaviors/random-stroll-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a RandomStrollBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomStrollBehavior = (
  behavior: Partial<RandomStrollBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.random_stroll': any } | undefined => {
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

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateInteger(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
  }

  // Validate xzDist
  if (behavior.xzDist !== undefined) {
    if (!validateInteger(behavior.xzDist, 'xzDist', 1)) {
      return undefined;
    }
    result.xz_dist = behavior.xzDist;
  }

  // Validate yDist
  if (behavior.yDist !== undefined) {
    if (!validateInteger(behavior.yDist, 'yDist', 1)) {
      return undefined;
    }
    result.y_dist = behavior.yDist;
  }

  return {
    'minecraft:behavior.random_stroll': result,
  };
};
