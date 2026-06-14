import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { InvestigateSuspiciousLocationBehavior } from '../../interfaces/behaviors/investigate-suspicious-location-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an InvestigateSuspiciousLocationBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertInvestigateSuspiciousLocationBehavior = (
  behavior: Partial<InvestigateSuspiciousLocationBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.investigate_suspicious_location': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  return {
    'minecraft:behavior.investigate_suspicious_location': result
  };
};
