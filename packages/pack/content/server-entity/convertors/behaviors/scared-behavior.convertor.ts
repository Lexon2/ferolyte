import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ScaredBehavior } from '../../interfaces/behaviors/scared-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a ScaredBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertScaredBehavior = (
  behavior: Partial<ScaredBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.scared': any } | undefined => {
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

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    if (!validateInteger(behavior.soundInterval, 'soundInterval')) {
      return undefined;
    }
    result.sound_interval = behavior.soundInterval;
  }

  return {
    'minecraft:behavior.scared': result
  };
};
