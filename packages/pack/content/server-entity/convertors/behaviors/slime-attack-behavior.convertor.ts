import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SlimeAttackBehavior } from '../../interfaces/behaviors/slime-attack-behavior';
import { validateNumber, validateBoolean } from '../common/validation';

/**
 * Converts a SlimeAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSlimeAttackBehavior = (
  behavior: Partial<SlimeAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.slime_attack': any } | undefined => {
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

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate xMaxRotation
  if (behavior.xMaxRotation !== undefined) {
    if (!validateNumber(behavior.xMaxRotation, 'xMaxRotation')) {
      return undefined;
    }
    result.x_max_rotation = behavior.xMaxRotation;
  }

  // Validate yMaxRotation
  if (behavior.yMaxRotation !== undefined) {
    if (!validateNumber(behavior.yMaxRotation, 'yMaxRotation')) {
      return undefined;
    }
    result.y_max_rotation = behavior.yMaxRotation;
  }

  return {
    'minecraft:behavior.slime_attack': result
  };
};
