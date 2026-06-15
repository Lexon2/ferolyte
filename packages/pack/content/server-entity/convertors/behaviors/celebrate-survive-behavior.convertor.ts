import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CelebrateSurviveBehavior } from '../../interfaces/behaviors/celebrate-survive-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a CelebrateSurviveBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertCelebrateSurviveBehavior = (
  behavior: Partial<CelebrateSurviveBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.celebrate_survive': any } | undefined => {
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

  // Validate fireworksInterval
  if (behavior.fireworksInterval !== undefined) {
    const convertedFireworksInterval = convertRange(
      behavior.fireworksInterval,
      'fireworksInterval',
    );
    if (!convertedFireworksInterval) {
      return undefined;
    }

    result.fireworks_interval = convertedFireworksInterval;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate onCelebrationEndEvent
  if (behavior.onCelebrationEndEvent !== undefined) {
    const convertedOnCelebrationEndEvent = convertTrigger(
      behavior.onCelebrationEndEvent,
    );
    if (!convertedOnCelebrationEndEvent) {
      return undefined;
    }
    result.on_celebration_end_event = convertedOnCelebrationEndEvent;
  }

  return {
    'minecraft:behavior.celebrate_survive': result,
  };
};
