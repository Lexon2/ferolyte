import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DigBehavior } from '../../interfaces/behaviors/dig-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a DigBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDigBehavior = (
  behavior: Partial<DigBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.dig': any } | undefined => {
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

  // Validate allowDigWhenNamed
  if (behavior.allowDigWhenNamed !== undefined) {
    if (typeof behavior.allowDigWhenNamed !== 'boolean') {
      console.error('allowDigWhenNamed must be a boolean');

      return undefined;
    }
    result.allow_dig_when_named = behavior.allowDigWhenNamed;
  }

  // Validate digsInDaylight
  if (behavior.digsInDaylight !== undefined) {
    if (typeof behavior.digsInDaylight !== 'boolean') {
      console.error('digsInDaylight must be a boolean');

      return undefined;
    }
    result.digs_in_daylight = behavior.digsInDaylight;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate idleTime
  if (behavior.idleTime !== undefined) {
    if (!validateNumber(behavior.idleTime, 'idleTime')) {
      return undefined;
    }
    result.idle_time = behavior.idleTime;
  }

  // Validate suspicionIsDisturbance
  if (behavior.suspicionIsDisturbance !== undefined) {
    if (!validateBoolean(behavior.suspicionIsDisturbance, 'suspicionIsDisturbance')) {
      return undefined;
    }
    result.suspicion_is_disturbance = behavior.suspicionIsDisturbance;
  }

  // Validate vibrationIsDisturbance
  if (behavior.vibrationIsDisturbance !== undefined) {
    if (!validateBoolean(behavior.vibrationIsDisturbance, 'vibrationIsDisturbance')) {
      return undefined;
    }
    result.vibration_is_disturbance = behavior.vibrationIsDisturbance;
  }

  // Validate onStart
  if (behavior.onStart !== undefined) {
    const onStart = convertTrigger(behavior.onStart, withFieldPath(ctx, 'onStart'));
    if (!onStart) {
      return undefined;
    }
    result.on_start = onStart;
  }

  return {
    'minecraft:behavior.dig': result
  };
};
