import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SonicBoomBehavior } from '../../interfaces/behaviors/sonic-boom-behavior';
import { validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts a SonicBoomBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSonicBoomBehavior = (
  behavior: Partial<SonicBoomBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.sonic_boom': any } | undefined => {
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

  // Validate attackCooldown
  if (behavior.attackCooldown !== undefined) {
    if (!validateNumber(behavior.attackCooldown, 'attackCooldown')) {
      return undefined;
    }
    result.attack_cooldown = behavior.attackCooldown;
  }

  // Validate attackDamage
  if (behavior.attackDamage !== undefined) {
    if (!validateNumber(behavior.attackDamage, 'attackDamage')) {
      return undefined;
    }
    result.attack_damage = behavior.attackDamage;
  }

  // Validate attackRangeHorizontal
  if (behavior.attackRangeHorizontal !== undefined) {
    if (!validateNumber(behavior.attackRangeHorizontal, 'attackRangeHorizontal')) {
      return undefined;
    }
    result.attack_range_horizontal = behavior.attackRangeHorizontal;
  }

  // Validate attackRangeVertical
  if (behavior.attackRangeVertical !== undefined) {
    if (!validateNumber(behavior.attackRangeVertical, 'attackRangeVertical')) {
      return undefined;
    }
    result.attack_range_vertical = behavior.attackRangeVertical;
  }

  // Validate attackSound
  if (behavior.attackSound !== undefined) {
    if (!validateSoundEvent(behavior.attackSound, 'attackSound')) {
      return undefined;
    }
    result.attack_sound = behavior.attackSound;
  }

  // Validate chargeSound
  if (behavior.chargeSound !== undefined) {
    if (!validateSoundEvent(behavior.chargeSound, 'chargeSound')) {
      return undefined;
    }
    result.charge_sound = behavior.chargeSound;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate durationUntilAttackSound
  if (behavior.durationUntilAttackSound !== undefined) {
    if (!validateNumber(behavior.durationUntilAttackSound, 'durationUntilAttackSound')) {
      return undefined;
    }
    result.duration_until_attack_sound = behavior.durationUntilAttackSound;
  }

  // Validate knockbackHeightCap
  if (behavior.knockbackHeightCap !== undefined) {
    if (!validateNumber(behavior.knockbackHeightCap, 'knockbackHeightCap')) {
      return undefined;
    }
    result.knockback_height_cap = behavior.knockbackHeightCap;
  }

  // Validate knockbackHorizontalStrength
  if (behavior.knockbackHorizontalStrength !== undefined) {
    if (!validateNumber(behavior.knockbackHorizontalStrength, 'knockbackHorizontalStrength')) {
      return undefined;
    }
    result.knockback_horizontal_strength = behavior.knockbackHorizontalStrength;
  }

  // Validate knockbackVerticalStrength
  if (behavior.knockbackVerticalStrength !== undefined) {
    if (!validateNumber(behavior.knockbackVerticalStrength, 'knockbackVerticalStrength')) {
      return undefined;
    }
    result.knockback_vertical_strength = behavior.knockbackVerticalStrength;
  }

  return {
    'minecraft:behavior.sonic_boom': result
  };
};
