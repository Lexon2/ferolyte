import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RandomSittingBehavior } from '../../interfaces/behaviors/random-sitting-behavior';
import { validateNumber, validatePercentage } from '../common/validation';

/**
 * Converts a RandomSittingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomSittingBehavior = (
  behavior: Partial<RandomSittingBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.random_sitting': any } | undefined => {
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

  // Validate cooldown
  if (behavior.cooldown !== undefined) {
    if (!validateNumber(behavior.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = behavior.cooldown;
  }

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate minSitTime
  if (behavior.minSitTime !== undefined) {
    if (!validateNumber(behavior.minSitTime, 'minSitTime')) {
      return undefined;
    }
    result.min_sit_time = behavior.minSitTime;
  }

  // Validate startChance
  if (behavior.startChance !== undefined) {
    if (!validatePercentage(behavior.startChance, 'startChance')) {
      return undefined;
    }
    result.start_chance = behavior.startChance;
  }

  // Validate stopChance
  if (behavior.stopChance !== undefined) {
    if (!validatePercentage(behavior.stopChance, 'stopChance')) {
      return undefined;
    }
    result.stop_chance = behavior.stopChance;
  }

  return {
    'minecraft:behavior.random_sitting': result
  };
};
