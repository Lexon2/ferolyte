import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { GuardianAttackBehavior } from '../../interfaces/behaviors/guardian-attack-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a GuardianAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertGuardianAttackBehavior = (
  behavior: Partial<GuardianAttackBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.guardian_attack': any } | undefined => {
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

  // Validate elderExtraMagicDamage
  if (behavior.elderExtraMagicDamage !== undefined) {
    if (
      !validateInteger(behavior.elderExtraMagicDamage, 'elderExtraMagicDamage')
    ) {
      return undefined;
    }
    result.elder_extra_magic_damage = behavior.elderExtraMagicDamage;
  }

  // Validate hardModeExtraMagicDamage
  if (behavior.hardModeExtraMagicDamage !== undefined) {
    if (
      !validateInteger(
        behavior.hardModeExtraMagicDamage,
        'hardModeExtraMagicDamage',
      )
    ) {
      return undefined;
    }
    result.hard_mode_extra_magic_damage = behavior.hardModeExtraMagicDamage;
  }

  // Validate magicDamage
  if (behavior.magicDamage !== undefined) {
    if (!validateInteger(behavior.magicDamage, 'magicDamage')) {
      return undefined;
    }
    result.magic_damage = behavior.magicDamage;
  }

  // Validate minDistance
  if (behavior.minDistance !== undefined) {
    if (!validateNumber(behavior.minDistance, 'minDistance')) {
      return undefined;
    }
    result.min_distance = behavior.minDistance;
  }

  // Validate soundDelayTime
  if (behavior.soundDelayTime !== undefined) {
    if (!validateNumber(behavior.soundDelayTime, 'soundDelayTime')) {
      return undefined;
    }
    result.sound_delay_time = behavior.soundDelayTime;
  }

  // Validate xMaxRotation
  if (behavior.xMaxRotation !== undefined) {
    if (!validateNumber(behavior.xMaxRotation, 'xMaxRotation')) {
      return undefined;
    }
    result.x_max_rotation = behavior.xMaxRotation;
  }

  // Validate yMaxHeadRotation
  if (behavior.yMaxHeadRotation !== undefined) {
    if (!validateNumber(behavior.yMaxHeadRotation, 'yMaxHeadRotation')) {
      return undefined;
    }
    result.y_max_head_rotation = behavior.yMaxHeadRotation;
  }

  return {
    'minecraft:behavior.guardian_attack': result,
  };
};
