import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { WorkBehavior } from '../../interfaces/behaviors/work-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateBoolean, validateInteger } from '../common/validation';

/**
 * Converts a WorkBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertWorkBehavior = (
  behavior: Partial<WorkBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.work': any } | undefined => {
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

  // Validate activeTime
  if (behavior.activeTime !== undefined) {
    if (!validateNumber(behavior.activeTime, 'activeTime')) {
      return undefined;
    }
    result.active_time = behavior.activeTime;
  }

  // Validate canWorkInRain
  if (behavior.canWorkInRain !== undefined) {
    if (!validateBoolean(behavior.canWorkInRain, 'canWorkInRain')) {
      return undefined;
    }
    result.can_work_in_rain = behavior.canWorkInRain;
  }

  // Validate goalCooldown
  if (behavior.goalCooldown !== undefined) {
    if (!validateNumber(behavior.goalCooldown, 'goalCooldown')) {
      return undefined;
    }
    result.goal_cooldown = behavior.goalCooldown;
  }


  // Validate onArrival
  if (behavior.onArrival !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onArrival, withFieldPath(ctx, 'onArrival'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_arrival = convertedTrigger;
  }

  // Validate soundDelayMax
  if (behavior.soundDelayMax !== undefined) {
    if (!validateInteger(behavior.soundDelayMax, 'soundDelayMax')) {
      return undefined;
    }
    result.sound_delay_max = behavior.soundDelayMax;
  }

  // Validate soundDelayMin
  if (behavior.soundDelayMin !== undefined) {
    if (!validateInteger(behavior.soundDelayMin, 'soundDelayMin')) {
      return undefined;
    }
    result.sound_delay_min = behavior.soundDelayMin;
  }

  // Validate workInRainTolerance
  if (behavior.workInRainTolerance !== undefined) {
    if (!validateInteger(behavior.workInRainTolerance, 'workInRainTolerance')) {
      return undefined;
    }
    result.work_in_rain_tolerance = behavior.workInRainTolerance;
  }

  return {
    'minecraft:behavior.work': result
  };
};
