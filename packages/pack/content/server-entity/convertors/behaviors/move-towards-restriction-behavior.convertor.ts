import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CONTROL_FLAG } from '../../constants/control-flags';
import { MoveTowardsRestrictionBehavior } from '../../interfaces/behaviors/move-towards-restriction-behavior';
import { validateNumber, validateStringArray } from '../common/validation';

/**
 * Converts a MoveTowardsRestrictionBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveTowardsRestrictionBehavior = (
  behavior: Partial<MoveTowardsRestrictionBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.move_towards_restriction': any } | undefined => {
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

  // Validate controlFlags
  if (behavior.controlFlags !== undefined) {
    if (!validateStringArray(behavior.controlFlags, 'controlFlags')) {
      return undefined;
    }
    for (const flag of behavior.controlFlags) {
      if (!CONTROL_FLAG.includes(flag)) {
        console.error('controlFlags must be an array of valid ControlFlag');

        return undefined;
      }
    }
    result.control_flags = behavior.controlFlags;
  }

  return {
    'minecraft:behavior.move_towards_restriction': result,
  };
};
