import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TimerFlag1Behavior } from '../../interfaces/behaviors/timer-flag-1-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateStringArray } from '../common/validation';

/**
 * Converts a TimerFlag1Behavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTimerFlag1Behavior = (
  behavior: Partial<TimerFlag1Behavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.timer_flag_1': any } | undefined => {
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

  // Validate cooldownRange
  if (behavior.cooldownRange !== undefined) {
    const convertedCooldownRange = convertRange(behavior.cooldownRange, 'cooldownRange');
    if (!convertedCooldownRange) {
      return undefined;
    }
    result.cooldown_range = convertedCooldownRange;
  }

  // Validate durationRange
  if (behavior.durationRange !== undefined) {
    const convertedDurationRange = convertRange(behavior.durationRange, 'durationRange');
    if (!convertedDurationRange) {
      return undefined;
    }
    result.duration_range = convertedDurationRange;
  }

  // Validate controlFlags
  if (behavior.controlFlags !== undefined) {
    if (!validateStringArray(behavior.controlFlags, 'controlFlags') || !behavior.controlFlags.every(flag => flag === 'move' || flag === 'look')) {
      return undefined;
    }
    result.control_flags = behavior.controlFlags;
  }

  // Validate onEnd
  if (behavior.onEnd !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onEnd, withFieldPath(ctx, 'onEnd'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_end = convertedTrigger;
  }

  // Validate onStart
  if (behavior.onStart !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onStart, withFieldPath(ctx, 'onStart'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_start = convertedTrigger;
  }

  return {
    'minecraft:behavior.timer_flag_1': result
  };
};
