import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RunAroundLikeCrazyBehavior } from '../../interfaces/behaviors/run-around-like-crazy-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RunAroundLikeCrazyBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRunAroundLikeCrazyBehavior = (
  behavior: Partial<RunAroundLikeCrazyBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.run_around_like_crazy': any } | undefined => {
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

  return {
    'minecraft:behavior.run_around_like_crazy': result
  };
};
