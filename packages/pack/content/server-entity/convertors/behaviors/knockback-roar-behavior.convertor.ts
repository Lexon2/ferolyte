import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { KnockbackRoarBehavior } from '../../interfaces/behaviors/knockback-roar-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
} from '../common/validation';

/**
 * Converts a KnockbackRoarBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertKnockbackRoarBehavior = (
  behavior: Partial<KnockbackRoarBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.knockback_roar': any } | undefined => {
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

  // Validate attackTime
  if (behavior.attackTime !== undefined) {
    if (!validateNumber(behavior.attackTime, 'attackTime')) {
      return undefined;
    }
    result.attack_time = behavior.attackTime;
  }

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate damageFilters
  if (behavior.damageFilters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.damageFilters, withFieldPath(ctx, 'damageFilters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.damage_filters = convertedFilters;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate knockbackDamage
  if (behavior.knockbackDamage !== undefined) {
    if (!validateInteger(behavior.knockbackDamage, 'knockbackDamage')) {
      return undefined;
    }
    result.knockback_damage = behavior.knockbackDamage;
  }

  // Validate knockbackStrength
  if (behavior.knockbackStrength !== undefined) {
    if (!validateInteger(behavior.knockbackStrength, 'knockbackStrength')) {
      return undefined;
    }
    result.knockback_strength = behavior.knockbackStrength;
  }

  // Validate knockbackFilters
  if (behavior.knockbackFilters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.knockbackFilters, withFieldPath(ctx, 'knockbackFilters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.knockback_filters = convertedFilters;
  }

  // Validate knockbackHorizontalStrength
  if (behavior.knockbackHorizontalStrength !== undefined) {
    if (
      !validateInteger(
        behavior.knockbackHorizontalStrength,
        'knockbackHorizontalStrength',
      )
    ) {
      return undefined;
    }
    result.knockback_horizontal_strength = behavior.knockbackHorizontalStrength;
  }

  // Validate knockbackRange
  if (behavior.knockbackRange !== undefined) {
    if (!validateInteger(behavior.knockbackRange, 'knockbackRange')) {
      return undefined;
    }
    result.knockback_range = behavior.knockbackRange;
  }

  // Validate knockbackVerticalStrength
  if (behavior.knockbackVerticalStrength !== undefined) {
    if (
      !validateInteger(
        behavior.knockbackVerticalStrength,
        'knockbackVerticalStrength',
      )
    ) {
      return undefined;
    }
    result.knockback_vertical_strength = behavior.knockbackVerticalStrength;
  }

  // Validate knockbackHeightCap
  if (behavior.knockbackHeightCap !== undefined) {
    if (!validateNumber(behavior.knockbackHeightCap, 'knockbackHeightCap')) {
      return undefined;
    }
    result.knockback_height_cap = behavior.knockbackHeightCap;
  }

  // Validate trackTarget
  if (behavior.trackTarget !== undefined) {
    if (!validateBoolean(behavior.trackTarget, 'trackTarget')) {
      return undefined;
    }
    result.track_target = behavior.trackTarget;
  }

  // Validate onRoarEnd
  if (behavior.onRoarEnd !== undefined) {
    const convertedOnRoarEnd = convertTrigger(behavior.onRoarEnd, withFieldPath(ctx, 'onRoarEnd'));
    if (!convertedOnRoarEnd) {
      return undefined;
    }
    result.on_roar_end = convertedOnRoarEnd;
  }

  return {
    'minecraft:behavior.knockback_roar': result,
  };
};
