import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FindCoverBehavior } from '../../interfaces/behaviors/find-cover-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a FindCoverBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFindCoverBehavior = (
  behavior: Partial<FindCoverBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.find_cover': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  return {
    'minecraft:behavior.find_cover': result
  };
};
