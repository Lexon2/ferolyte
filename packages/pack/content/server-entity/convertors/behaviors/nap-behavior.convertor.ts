import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { NapBehavior } from '../../interfaces/behaviors/nap-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a NapBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertNapBehavior = (
  behavior: Partial<NapBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.nap': any } | undefined => {
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

  // Validate cooldownMax
  if (behavior.cooldownMax !== undefined) {
    if (!validateNumber(behavior.cooldownMax, 'cooldownMax')) {
      return undefined;
    }
    result.cooldown_max = behavior.cooldownMax;
  }

  // Validate cooldownMin
  if (behavior.cooldownMin !== undefined) {
    if (!validateNumber(behavior.cooldownMin, 'cooldownMin')) {
      return undefined;
    }
    result.cooldown_min = behavior.cooldownMin;
  }

  // Validate mobDetectDist
  if (behavior.mobDetectDist !== undefined) {
    if (!validateNumber(behavior.mobDetectDist, 'mobDetectDist')) {
      return undefined;
    }
    result.mob_detect_dist = behavior.mobDetectDist;
  }

  // Validate mobDetectHeight
  if (behavior.mobDetectHeight !== undefined) {
    if (!validateNumber(behavior.mobDetectHeight, 'mobDetectHeight')) {
      return undefined;
    }
    result.mob_detect_height = behavior.mobDetectHeight;
  }

  // Validate canNapFilters
  if (behavior.canNapFilters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.canNapFilters, withFieldPath(ctx, 'canNapFilters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.can_nap_filters = convertedFilters;
  }

  // Validate wakeMobExceptions
  if (behavior.wakeMobExceptions !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.wakeMobExceptions, withFieldPath(ctx, 'wakeMobExceptions'));
    if (!convertedFilters) {
      return undefined;
    }
    result.wake_mob_exceptions = convertedFilters;
  }

  return {
    'minecraft:behavior.nap': result
  };
};
