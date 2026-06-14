import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MingleBehavior } from '../../interfaces/behaviors/mingle-behavior';
import { validateNumber, validateString, validateStringArray } from '../common/validation';

/**
 * Converts a MingleBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMingleBehavior = (
  behavior: Partial<MingleBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.mingle': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate mingleDistance
  if (behavior.mingleDistance !== undefined) {
    if (!validateNumber(behavior.mingleDistance, 'mingleDistance')) {
      return undefined;
    }
    result.mingle_distance = behavior.mingleDistance;
  }

  // Validate mingleTime
  if (behavior.mingleTime !== undefined) {
    if (!validateNumber(behavior.mingleTime, 'mingleTime')) {
      return undefined;
    }
    result.mingle_time = behavior.mingleTime;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate minglePartnerType
  if (behavior.minglePartnerType !== undefined) {
    if (Array.isArray(behavior.minglePartnerType) && !validateStringArray(behavior.minglePartnerType, 'minglePartnerType')) {
      return undefined;
    } else if (!validateString(behavior.minglePartnerType, 'minglePartnerType')) {
      return undefined;
    }
    result.mingle_partner_type = behavior.minglePartnerType;
  }

  return {
    'minecraft:behavior.mingle': result
  };
};
