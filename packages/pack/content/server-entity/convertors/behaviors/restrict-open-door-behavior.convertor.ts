import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RestrictOpenDoorBehavior } from '../../interfaces/behaviors/restrict-open-door-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RestrictOpenDoorBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRestrictOpenDoorBehavior = (
  behavior: Partial<RestrictOpenDoorBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.restrict_open_door': any } | undefined => {
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
    'minecraft:behavior.restrict_open_door': result
  };
};
