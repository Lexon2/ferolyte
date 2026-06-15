import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { RandomSwimBehavior } from '../../interfaces/behaviors/random-swim-behavior';
import {
  validateNumber,
  validateBoolean,
  validateInteger,
} from '../common/validation';

/**
 * Converts a RandomSwimBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomSwimBehavior = (
  behavior: Partial<RandomSwimBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.random_swim': any } | undefined => {
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

  // Validate avoidSurface
  if (behavior.avoidSurface !== undefined) {
    if (!validateBoolean(behavior.avoidSurface, 'avoidSurface')) {
      return undefined;
    }
    result.avoid_surface = behavior.avoidSurface;
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
    'minecraft:behavior.random_swim': result,
  };
};
