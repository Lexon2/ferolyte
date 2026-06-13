import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RestrictSunBehavior } from '../../interfaces/behaviors/restrict-sun-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RestrictSunBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRestrictSunBehavior = (
  behavior: Partial<RestrictSunBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.restrict_sun': any } | undefined => {
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

  return {
    'minecraft:behavior.restrict_sun': result
  };
};
