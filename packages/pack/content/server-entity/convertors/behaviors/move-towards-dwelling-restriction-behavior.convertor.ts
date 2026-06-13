import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MoveTowardsDwellingRestrictionBehavior } from '../../interfaces/behaviors/move-towards-dwelling-restriction-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveTowardsDwellingRestrictionBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveTowardsDwellingRestrictionBehavior = (
  behavior: Partial<MoveTowardsDwellingRestrictionBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_towards_dwelling_restriction': any } | undefined => {
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

  return {
    'minecraft:behavior.move_towards_dwelling_restriction': result
  };
};
