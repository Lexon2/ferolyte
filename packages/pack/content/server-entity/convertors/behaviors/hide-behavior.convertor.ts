import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { HideBehavior } from '../../interfaces/behaviors/hide-behavior';
import { validateNumber, validateString } from '../common/validation';

/**
 * Converts a HideBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertHideBehavior = (
  behavior: Partial<HideBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.hide': any } | undefined => {
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

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate poiType
  if (behavior.poiType !== undefined) {
    if (!validateString(behavior.poiType, 'poiType')) {
      return undefined;
    }
    result.poi_type = behavior.poiType;
  }

  // Validate timeoutCooldown
  if (behavior.timeoutCooldown !== undefined) {
    if (!validateNumber(behavior.timeoutCooldown, 'timeoutCooldown')) {
      return undefined;
    }
    result.timeout_cooldown = behavior.timeoutCooldown;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  return {
    'minecraft:behavior.hide': result
  };
};
