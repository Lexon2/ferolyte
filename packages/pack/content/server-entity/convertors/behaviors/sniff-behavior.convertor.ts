import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SniffBehavior } from '../../interfaces/behaviors/sniff-behavior';
import { convertRange } from '../common/convertors';
import { validateNumber } from '../common/validation';

/**
 * Converts a SniffBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSniffBehavior = (
  behavior: Partial<SniffBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.sniff': any } | undefined => {
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

  // Validate cooldownRange
  if (behavior.cooldownRange !== undefined) {
    const convertedCooldownRange = convertRange(behavior.cooldownRange, 'cooldownRange');
    if (!convertedCooldownRange) {
      return undefined;
    }
    result.cooldown_range = convertedCooldownRange;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate sniffingRadius
  if (behavior.sniffingRadius !== undefined) {
    if (!validateNumber(behavior.sniffingRadius, 'sniffingRadius')) {
      return undefined;
    }
    result.sniffing_radius = behavior.sniffingRadius;
  }

  // Validate suspicionRadiusHorizontal
  if (behavior.suspicionRadiusHorizontal !== undefined) {
    if (!validateNumber(behavior.suspicionRadiusHorizontal, 'suspicionRadiusHorizontal')) {
      return undefined;
    }
    result.suspicion_radius_horizontal = behavior.suspicionRadiusHorizontal;
  }

  // Validate suspicionRadiusVertical
  if (behavior.suspicionRadiusVertical !== undefined) {
    if (!validateNumber(behavior.suspicionRadiusVertical, 'suspicionRadiusVertical')) {
      return undefined;
    }
    result.suspicion_radius_vertical = behavior.suspicionRadiusVertical;
  }

  return {
    'minecraft:behavior.sniff': result
  };
};
