import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FleeSunBehavior } from '../../interfaces/behaviors/flee-sun-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a FleeSunBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFleeSunBehavior = (
  behavior: Partial<FleeSunBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.flee_sun': any } | undefined => {
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
    'minecraft:behavior.flee_sun': result
  };
};
