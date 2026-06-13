import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { StrollTowardsVillageBehavior } from '../../interfaces/behaviors/stroll-towards-village-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a StrollTowardsVillageBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStrollTowardsVillageBehavior = (
  behavior: Partial<StrollTowardsVillageBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.stroll_towards_village': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate startChance
  if (behavior.startChance !== undefined) {
    if (!validateNumber(behavior.startChance, 'startChance')) {
      return undefined;
    }
    result.start_chance = behavior.startChance;
  }

  return {
    'minecraft:behavior.stroll_towards_village': result
  };
};
