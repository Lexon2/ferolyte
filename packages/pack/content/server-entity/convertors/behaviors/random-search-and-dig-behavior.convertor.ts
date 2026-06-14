import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RandomSearchAndDigBehavior } from '../../interfaces/behaviors/random-search-and-dig-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateString, validateStringArray } from '../common/validation';

/**
 * Converts a RandomSearchAndDigBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomSearchAndDigBehavior = (
  behavior: Partial<RandomSearchAndDigBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.random_search_and_dig': any } | undefined => {
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

  // Validate cooldownRange
  if (behavior.cooldownRange !== undefined) {
    const convertedCooldownRange = convertRange(behavior.cooldownRange, 'cooldownRange', 0);
    if (!convertedCooldownRange) {
      return undefined;
    }
    result.cooldown_range = convertedCooldownRange;
  }

  // Validate diggingDurationRange
  if (behavior.diggingDurationRange !== undefined) {
    const convertedDiggingDurationRange = convertRange(behavior.diggingDurationRange, 'diggingDurationRange');
    if (!convertedDiggingDurationRange) {
      return undefined;
    }
    result.digging_duration_range = convertedDiggingDurationRange;
  }

  // Validate findValidPositionRetries
  if (behavior.findValidPositionRetries !== undefined) {
    if (!validateNumber(behavior.findValidPositionRetries, 'findValidPositionRetries')) {
      return undefined;
    }
    result.find_valid_position_retries = behavior.findValidPositionRetries;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate itemTable
  if (behavior.itemTable !== undefined) {
    if (!validateString(behavior.itemTable, 'itemTable')) {
      return undefined;
    }
    result.item_table = behavior.itemTable;
  }

  // Validate onDiggingStart
  if (behavior.onDiggingStart !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onDiggingStart, withFieldPath(ctx, 'onDiggingStart'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_digging_start = convertedTrigger;
  }

  // Validate onFailDuringDigging
  if (behavior.onFailDuringDigging !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onFailDuringDigging, withFieldPath(ctx, 'onFailDuringDigging'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_fail_during_digging = convertedTrigger;
  }

  // Validate onFailDuringSearching
  if (behavior.onFailDuringSearching !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onFailDuringSearching, withFieldPath(ctx, 'onFailDuringSearching'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_fail_during_searching = convertedTrigger;
  }

  // Validate onItemFound
  if (behavior.onItemFound !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onItemFound, withFieldPath(ctx, 'onItemFound'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_item_found = convertedTrigger;
  }

  // Validate onSearchingStart
  if (behavior.onSearchingStart !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onSearchingStart, withFieldPath(ctx, 'onSearchingStart'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_searching_start = convertedTrigger;
  }

  // Validate onSuccess
  if (behavior.onSuccess !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onSuccess, withFieldPath(ctx, 'onSuccess'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_success = convertedTrigger;
  }

  // Validate searchRangeXz
  if (behavior.searchRangeXz !== undefined) {
    if (!validateNumber(behavior.searchRangeXz, 'searchRangeXz')) {
      return undefined;
    }
    result.search_range_xz = behavior.searchRangeXz;
  }

  // Validate searchRangeY
  if (behavior.searchRangeY !== undefined) {
    if (!validateNumber(behavior.searchRangeY, 'searchRangeY')) {
      return undefined;
    }
    result.search_range_y = behavior.searchRangeY;
  }

  // Validate spawnItemAfterSeconds
  if (behavior.spawnItemAfterSeconds !== undefined) {
    if (!validateNumber(behavior.spawnItemAfterSeconds, 'spawnItemAfterSeconds')) {
      return undefined;
    }
    result.spawn_item_after_seconds = behavior.spawnItemAfterSeconds;
  }

  // Validate spawnItemPosOffset
  if (behavior.spawnItemPosOffset !== undefined) {
    if (!validateNumber(behavior.spawnItemPosOffset, 'spawnItemPosOffset')) {
      return undefined;
    }
    result.spawn_item_pos_offset = behavior.spawnItemPosOffset;
  }

  // Validate targetBlocks
  if (behavior.targetBlocks !== undefined) {
    if (!validateStringArray(behavior.targetBlocks, 'targetBlocks')) {
      return undefined;
    }
    result.target_blocks = behavior.targetBlocks.map((block) => block.toLowerCase());
  }

  // Validate targetDigPositionOffset
  if (behavior.targetDigPositionOffset !== undefined) {
    if (!validateNumber(behavior.targetDigPositionOffset, 'targetDigPositionOffset')) {
      return undefined;
    }
    result.target_dig_position_offset = behavior.targetDigPositionOffset;
  }

  return {
    'minecraft:behavior.random_search_and_dig': result
  };
};
