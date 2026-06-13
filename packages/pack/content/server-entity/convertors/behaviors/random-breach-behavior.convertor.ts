import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RandomBreachBehavior } from '../../interfaces/behaviors/random-breach-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a RandomBreachBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomBreachBehavior = (
  behavior: Partial<RandomBreachBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.random_breach': any } | undefined => {
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
    'minecraft:behavior.random_breach': result
  };
};
