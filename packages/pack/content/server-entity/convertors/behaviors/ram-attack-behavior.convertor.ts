import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RamAttackBehavior } from '../../interfaces/behaviors/ram-attack-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts a RamAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRamAttackBehavior = (
  behavior: Partial<RamAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.ram_attack': any } | undefined => {
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

  // Validate babyKnockbackModifier
  if (behavior.babyKnockbackModifier !== undefined) {
    if (!validateNumber(behavior.babyKnockbackModifier, 'babyKnockbackModifier')) {
      return undefined;
    }
    result.baby_knockback_modifier = behavior.babyKnockbackModifier;
  }

  // Validate cooldownRange
  if (behavior.cooldownRange !== undefined) {
    const convertedCooldownRange = convertRange(behavior.cooldownRange, 'cooldownRange');
    if (!convertedCooldownRange) {
      return undefined;
    }
    result.cooldown_range = convertedCooldownRange;
  }

  // Validate knockbackForce
  if (behavior.knockbackForce !== undefined) {
    if (!validateNumber(behavior.knockbackForce, 'knockbackForce')) {
      return undefined;
    }
    result.knockback_force = behavior.knockbackForce;
  }

  // Validate knockbackHeight
  if (behavior.knockbackHeight !== undefined) {
    if (!validateNumber(behavior.knockbackHeight, 'knockbackHeight')) {
      return undefined;
    }
    result.knockback_height = behavior.knockbackHeight;
  }

  // Validate minRamDistance
  if (behavior.minRamDistance !== undefined) {
    if (!validateNumber(behavior.minRamDistance, 'minRamDistance')) {
      return undefined;
    }
    result.min_ram_distance = behavior.minRamDistance;
  }

  // Validate onStart
  if (behavior.onStart !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onStart, withFieldPath(ctx, 'onStart'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_start = convertedTrigger;
  }

  // Validate preRamSound
  if (behavior.preRamSound !== undefined) {
    if (!validateSoundEvent(behavior.preRamSound, 'preRamSound')) {
      return undefined;
    }
    result.pre_ram_sound = behavior.preRamSound;
  }

  // Validate ramDistance
  if (behavior.ramDistance !== undefined) {
    if (!validateNumber(behavior.ramDistance, 'ramDistance')) {
      return undefined;
    }
    result.ram_distance = behavior.ramDistance;
  }

  // Validate ramImpactSound
  if (behavior.ramImpactSound !== undefined) {
    if (!validateSoundEvent(behavior.ramImpactSound, 'ramImpactSound')) {
      return undefined;
    }
    result.ram_impact_sound = behavior.ramImpactSound;
  }

  // Validate ramSpeed
  if (behavior.ramSpeed !== undefined) {
    if (!validateNumber(behavior.ramSpeed, 'ramSpeed')) {
      return undefined;
    }
    result.ram_speed = behavior.ramSpeed;
  }

  // Validate runSpeed
  if (behavior.runSpeed !== undefined) {
    if (!validateNumber(behavior.runSpeed, 'runSpeed')) {
      return undefined;
    }
    result.run_speed = behavior.runSpeed;
  }

  // Validate trigger
  if (behavior.trigger !== undefined) {
    const convertedTrigger = convertTrigger(behavior.trigger, withFieldPath(ctx, 'trigger'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.trigger = convertedTrigger;
  }

  return {
    'minecraft:behavior.ram_attack': result
  };
};
