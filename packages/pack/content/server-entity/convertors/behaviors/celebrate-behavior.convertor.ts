import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CelebrateBehavior } from '../../interfaces/behaviors/celebrate-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts a CelebrateBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertCelebrateBehavior = (
  behavior: Partial<CelebrateBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.celebrate': any } | undefined => {
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

  // Validate celebrationSound
  if (behavior.celebrationSound !== undefined) {
    if (!validateSoundEvent(behavior.celebrationSound, 'celebrationSound')) {
      return undefined;
    }
    result.celebration_sound = behavior.celebrationSound;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate jumpInterval
  if (behavior.jumpInterval !== undefined) {
    const convertedJumpInterval = convertRange(
      behavior.jumpInterval,
      'jumpInterval',
    );
    if (!convertedJumpInterval) {
      return undefined;
    }

    result.jump_interval = convertedJumpInterval;
  }

  // Validate onCelebrationEndEvent
  if (behavior.onCelebrationEndEvent !== undefined) {
    const convertedOnCelebrationEndEvent = convertTrigger(
      behavior.onCelebrationEndEvent,
      withFieldPath(ctx, 'onCelebrationEndEvent'),
    );
    if (!convertedOnCelebrationEndEvent) {
      return undefined;
    }
    result.on_celebration_end_event = convertedOnCelebrationEndEvent;
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
    'minecraft:behavior.celebrate': result,
  };
};
