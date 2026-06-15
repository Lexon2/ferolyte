import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { LayDownBehavior } from '../../interfaces/behaviors/lay-down-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a LayDownBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertLayDownBehavior = (
  behavior: Partial<LayDownBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.lay_down': any } | undefined => {
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

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateInteger(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
  }

  // Validate randomStopInterval
  if (behavior.randomStopInterval !== undefined) {
    if (!validateInteger(behavior.randomStopInterval, 'randomStopInterval')) {
      return undefined;
    }
    result.random_stop_interval = behavior.randomStopInterval;
  }

  return {
    'minecraft:behavior.lay_down': result,
  };
};
