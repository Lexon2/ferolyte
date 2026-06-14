import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EmergeBehavior } from '../../interfaces/behaviors/emerge-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts an EmergeBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEmergeBehavior = (
  behavior: Partial<EmergeBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.emerge': any } | undefined => {
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

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate onDone
  if (behavior.onDone !== undefined) {
    const onDone = convertTrigger(behavior.onDone, withFieldPath(ctx, 'onDone'));
    if (!onDone) {
      return undefined;
    }
    result.on_done = onDone;
  }

  return {
    'minecraft:behavior.emerge': result
  };
};
