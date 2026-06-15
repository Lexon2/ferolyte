import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { HarvestFarmBlockBehavior } from '../../interfaces/behaviors/harvest-farm-block-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a HarvestFarmBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertHarvestFarmBlockBehavior = (
  behavior: Partial<HarvestFarmBlockBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.harvest_farm_block': any } | undefined => {
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

  // Validate maxSecondsBeforeSearch
  if (behavior.maxSecondsBeforeSearch !== undefined) {
    if (
      !validateNumber(behavior.maxSecondsBeforeSearch, 'maxSecondsBeforeSearch')
    ) {
      return undefined;
    }
    result.max_seconds_before_search = behavior.maxSecondsBeforeSearch;
  }

  // Validate searchCooldownMaxSeconds
  if (behavior.searchCooldownMaxSeconds !== undefined) {
    if (
      !validateNumber(
        behavior.searchCooldownMaxSeconds,
        'searchCooldownMaxSeconds',
      )
    ) {
      return undefined;
    }
    result.search_cooldown_max_seconds = behavior.searchCooldownMaxSeconds;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateInteger(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate secondsUntilNewTask
  if (behavior.secondsUntilNewTask !== undefined) {
    if (!validateNumber(behavior.secondsUntilNewTask, 'secondsUntilNewTask')) {
      return undefined;
    }
    result.seconds_until_new_task = behavior.secondsUntilNewTask;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  return {
    'minecraft:behavior.harvest_farm_block': result,
  };
};
