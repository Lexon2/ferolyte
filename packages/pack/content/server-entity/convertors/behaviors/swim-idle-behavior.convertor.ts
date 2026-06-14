import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SwimIdleBehavior } from '../../interfaces/behaviors/swim-idle-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SwimIdleBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwimIdleBehavior = (
  behavior: Partial<SwimIdleBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.swim_idle': any } | undefined => {
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

  // Validate idleTime
  if (behavior.idleTime !== undefined) {
    if (!validateNumber(behavior.idleTime, 'idleTime')) {
      return undefined;
    }
    result.idle_time = behavior.idleTime;
  }

  // Validate successRate
  if (behavior.successRate !== undefined) {
    if (!validateNumber(behavior.successRate, 'successRate')) {
      return undefined;
    }
    result.success_rate = behavior.successRate;
  }

  return {
    'minecraft:behavior.swim_idle': result
  };
};
