import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FertilizeFarmBlockBehavior } from '../../interfaces/behaviors/fertilize-farm-block-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a FertilizeFarmBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFertilizeFarmBlockBehavior = (
  behavior: Partial<FertilizeFarmBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.fertilize_farm_block': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate maxFertilizerUsage
  if (behavior.maxFertilizerUsage !== undefined) {
    if (!validateNumber(behavior.maxFertilizerUsage, 'maxFertilizerUsage')) {
      return undefined;
    }
    result.max_fertilizer_usage = behavior.maxFertilizerUsage;
  }

  // Validate searchCooldownMaxSeconds
  if (behavior.searchCooldownMaxSeconds !== undefined) {
    if (!validateNumber(behavior.searchCooldownMaxSeconds, 'searchCooldownMaxSeconds')) {
      return undefined;
    }
    result.search_cooldown_max_seconds = behavior.searchCooldownMaxSeconds;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateNumber(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateNumber(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateNumber(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  return {
    'minecraft:behavior.fertilize_farm_block': result
  };
};
