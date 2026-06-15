import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ControlledByPlayerBehavior } from '../../interfaces/behaviors/controlled-by-player-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a ControlledByPlayerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertControlledByPlayerBehavior = (
  behavior: Partial<ControlledByPlayerBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.controlled_by_player': any } | undefined => {
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

  // Validate fractionalRotation
  if (behavior.fractionalRotation !== undefined) {
    if (!validateNumber(behavior.fractionalRotation, 'fractionalRotation')) {
      return undefined;
    }
    result.fractional_rotation = behavior.fractionalRotation;
  }

  // Validate fractionalRotationLimit
  if (behavior.fractionalRotationLimit !== undefined) {
    if (
      !validateNumber(
        behavior.fractionalRotationLimit,
        'fractionalRotationLimit',
      )
    ) {
      return undefined;
    }
    result.fractional_rotation_limit = behavior.fractionalRotationLimit;
  }

  // Validate mountSpeedMultiplier
  if (behavior.mountSpeedMultiplier !== undefined) {
    if (
      !validateNumber(behavior.mountSpeedMultiplier, 'mountSpeedMultiplier')
    ) {
      return undefined;
    }
    result.mount_speed_multiplier = behavior.mountSpeedMultiplier;
  }

  return {
    'minecraft:behavior.controlled_by_player': result,
  };
};
