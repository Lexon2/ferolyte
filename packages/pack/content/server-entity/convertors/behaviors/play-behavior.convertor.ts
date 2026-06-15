import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PlayBehavior } from '../../interfaces/behaviors/play-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateInteger,
  validateNumber,
  validatePercentage,
  validateVector3,
} from '../common/validation';

/**
 * Converts a PlayBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPlayBehavior = (
  behavior: Partial<PlayBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.play': any } | undefined => {
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

  // Validate chanceToStart
  if (behavior.chanceToStart !== undefined) {
    if (!validatePercentage(behavior.chanceToStart, 'chanceToStart')) {
      return undefined;
    }
    result.chance_to_start = behavior.chanceToStart;
  }

  // Validate followDistance
  if (behavior.followDistance !== undefined) {
    if (!validateInteger(behavior.followDistance, 'followDistance')) {
      return undefined;
    }
    result.follow_distance = behavior.followDistance;
  }

  // Validate friendSearchArea
  if (behavior.friendSearchArea !== undefined) {
    if (!validateVector3(behavior.friendSearchArea, 'friendSearchArea')) {
      return undefined;
    }
    result.friend_search_area = behavior.friendSearchArea;
  }

  // Validate friendTypes
  if (behavior.friendTypes !== undefined) {
    if (!Array.isArray(behavior.friendTypes)) {
      return undefined;
    }
    const convertedFilters = behavior.friendTypes.map((filter, index) =>
      convertEntityFilters(filter, withFieldPath(ctx, `friendTypes[${index}]`)),
    );
    if (convertedFilters.some((filter) => !filter)) {
      return undefined;
    }
    result.friend_types = convertedFilters;
  }

  // Validate maxPlayDurationSeconds
  if (behavior.maxPlayDurationSeconds !== undefined) {
    if (
      !validateNumber(behavior.maxPlayDurationSeconds, 'maxPlayDurationSeconds')
    ) {
      return undefined;
    }
    result.max_play_duration_seconds = behavior.maxPlayDurationSeconds;
  }

  // Validate randomPosSearchHeight
  if (behavior.randomPosSearchHeight !== undefined) {
    if (
      !validateInteger(
        behavior.randomPosSearchHeight,
        'randomPosSearchHeight',
        1,
      )
    ) {
      return undefined;
    }
    result.random_pos_search_height = behavior.randomPosSearchHeight;
  }

  // Validate randomPosSearchRange
  if (behavior.randomPosSearchRange !== undefined) {
    if (
      !validateInteger(behavior.randomPosSearchRange, 'randomPosSearchRange', 1)
    ) {
      return undefined;
    }
    result.random_pos_search_range = behavior.randomPosSearchRange;
  }

  return {
    'minecraft:behavior.play': result,
  };
};
