import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MoveToBlockBehavior } from '../../interfaces/behaviors/move-to-block-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateInteger,
  validateNumber,
  validatePercentage,
  validateString,
  validateStringArray,
  validateVector3,
} from '../common/validation';

/**
 * Converts a MoveToBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveToBlockBehavior = (
  behavior: Partial<MoveToBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_to_block': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate onStayCompleted
  if (behavior.onStayCompleted !== undefined) {
    const convertedOnStayCompleted = convertTrigger(behavior.onStayCompleted, withFieldPath(ctx, 'onStayCompleted'));
    if (!convertedOnStayCompleted) {
      return undefined;
    }
    result.on_stay_completed = convertedOnStayCompleted;
  }

  // Validate onReach
  if (behavior.onReach !== undefined) {
    const convertedOnReach = convertTrigger(behavior.onReach, withFieldPath(ctx, 'onReach'));
    if (!convertedOnReach) {
      return undefined;
    }
    result.on_reach = convertedOnReach;
  }

  // Validate startChance
  if (behavior.startChance !== undefined) {
    if (!validatePercentage(behavior.startChance, 'startChance')) {
      return undefined;
    }
    result.start_chance = behavior.startChance;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate stayDuration
  if (behavior.stayDuration !== undefined) {
    if (!validateInteger(behavior.stayDuration, 'stayDuration')) {
      return undefined;
    }
    result.stay_duration = behavior.stayDuration;
  }

  // Validate targetSelectionMethod
  if (behavior.targetSelectionMethod !== undefined) {
    if (
      !validateString(
        behavior.targetSelectionMethod,
        'targetSelectionMethod',
      ) ||
      !['nearest', 'random'].includes(behavior.targetSelectionMethod)
    ) {
      return undefined;
    }
    result.target_selection_method = behavior.targetSelectionMethod;
  }

  // Validate targetOffset
  if (behavior.targetOffset !== undefined) {
    if (!validateVector3(behavior.targetOffset, 'targetOffset')) {
      return undefined;
    }
    result.target_offset = behavior.targetOffset;
  }

  // Validate targetBlocks
  if (behavior.targetBlocks !== undefined) {
    if (!validateStringArray(behavior.targetBlocks, 'targetBlocks')) {
      return undefined;
    }
    result.target_blocks = behavior.targetBlocks;
  }

  // Validate targetBlockFilters
  if (behavior.targetBlockFilters !== undefined) {
    const convertedTargetBlockFilters = convertEntityFilters(behavior.targetBlockFilters, withFieldPath(ctx, 'targetBlockFilters'));
    if (!convertedTargetBlockFilters) {
      return undefined;
    }
    result.target_block_filters = convertedTargetBlockFilters;
  }
  return {
    'minecraft:behavior.move_to_block': result,
  };
};
