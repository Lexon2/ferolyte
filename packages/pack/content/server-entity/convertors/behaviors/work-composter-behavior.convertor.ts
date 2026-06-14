import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { WorkComposterBehavior } from '../../interfaces/behaviors/work-composter-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateBoolean, validateInteger } from '../common/validation';

/**
 * Converts a WorkComposterBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertWorkComposterBehavior = (
  behavior: Partial<WorkComposterBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.work_composter': any } | undefined => {
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

  // Validate blockInteractionMax
  if (behavior.blockInteractionMax !== undefined) {
    if (!validateInteger(behavior.blockInteractionMax, 'blockInteractionMax')) {
      return undefined;
    }
    result.block_interaction_max = behavior.blockInteractionMax;
  }

  // Validate canEmptyComposter
  if (behavior.canEmptyComposter !== undefined) {
    if (!validateBoolean(behavior.canEmptyComposter, 'canEmptyComposter')) {
      return undefined;
    }
    result.can_empty_composter = behavior.canEmptyComposter;
  }

  // Validate canFillComposter
  if (behavior.canFillComposter !== undefined) {
    if (!validateBoolean(behavior.canFillComposter, 'canFillComposter')) {
      return undefined;
    }
    result.can_fill_composter = behavior.canFillComposter;
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

  // Validate itemsPerUseMax
  if (behavior.itemsPerUseMax !== undefined) {
    if (!validateInteger(behavior.itemsPerUseMax, 'itemsPerUseMax')) {
      return undefined;
    }
    result.items_per_use_max = behavior.itemsPerUseMax;
  }

  // Validate minItemCount
  if (behavior.minItemCount !== undefined) {
    if (!validateInteger(behavior.minItemCount, 'minItemCount')) {
      return undefined;
    }
    result.min_item_count = behavior.minItemCount;
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

  // Validate useBlockMax
  if (behavior.useBlockMax !== undefined) {
    if (!validateInteger(behavior.useBlockMax, 'useBlockMax')) {
      return undefined;
    }
    result.use_block_max = behavior.useBlockMax;
  }

  // Validate workInRainTolerance
  if (behavior.workInRainTolerance !== undefined) {
    if (!validateInteger(behavior.workInRainTolerance, 'workInRainTolerance')) {
      return undefined;
    }
    result.work_in_rain_tolerance = behavior.workInRainTolerance;
  }

  return {
    'minecraft:behavior.work_composter': result
  };
};
