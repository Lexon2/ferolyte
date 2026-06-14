import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';

import { TARGET_SELECTION_METHODS } from '../../constants/target-selection-method';
import { AvoidBlockBehavior } from '../../interfaces/behaviors/avoid-block-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateNumber,
  validateSoundEvent,
  validateStringArray,
  validateAllowedValues,
} from '../common/validation';

/**
 * Converts an AvoidBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertAvoidBlockBehavior = (
  behavior: Partial<AvoidBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.avoid_block': any } | undefined => {
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

  // Validate tickInterval
  if (behavior.tickInterval !== undefined) {
    if (!validateNumber(behavior.tickInterval, 'tickInterval')) {
      return undefined;
    }
    result.tick_interval = behavior.tickInterval;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateNumber(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateNumber(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate sprintSpeedModifier
  if (behavior.sprintSpeedModifier !== undefined) {
    if (!validateNumber(behavior.sprintSpeedModifier, 'sprintSpeedModifier')) {
      return undefined;
    }
    result.sprint_speed_modifier = behavior.sprintSpeedModifier;
  }

  // Validate targetSelectionMethod
  if (behavior.targetSelectionMethod !== undefined) {
    if (
      !validateAllowedValues(
        behavior.targetSelectionMethod,
        TARGET_SELECTION_METHODS,
        'targetSelectionMethod',
      )
    ) {
      return undefined;
    }
    result.target_selection_method = behavior.targetSelectionMethod;
  }

  // Validate targetBlocks
  if (behavior.targetBlocks !== undefined) {
    if (!validateStringArray(behavior.targetBlocks, 'targetBlocks')) {
      return undefined;
    }
    result.target_blocks = behavior.targetBlocks;
  }

  // Validate avoidBlockSound
  if (behavior.avoidBlockSound !== undefined) {
    if (!validateSoundEvent(behavior.avoidBlockSound, 'avoidBlockSound')) {
      return undefined;
    }
    result.avoid_block_sound = behavior.avoidBlockSound;
  }

  // Validate walkSpeedModifier
  if (behavior.walkSpeedModifier !== undefined) {
    if (!validateNumber(behavior.walkSpeedModifier, 'walkSpeedModifier')) {
      return undefined;
    }
    result.walk_speed_modifier = behavior.walkSpeedModifier;
  }

  // Validate onEscape
  if (behavior.onEscape !== undefined) {
    const convertedOnEscape = convertTrigger(behavior.onEscape, withFieldPath(ctx, 'onEscape'));
    if (!convertedOnEscape) {
      return undefined;
    }
    result.on_escape = convertedOnEscape;
  }

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    const convertedSoundInterval = convertRange(
      behavior.soundInterval,
      'soundInterval',
    );
    if (!convertedSoundInterval) {
      return undefined;
    }

    result.sound_interval = convertedSoundInterval;
  }

  return {
    'minecraft:behavior.avoid_block': result,
  };
};
