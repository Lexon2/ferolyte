import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MoveTowardsHomeRestrictionBehavior } from '../../interfaces/behaviors/move-towards-home-restriction-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveTowardsHomeRestrictionBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveTowardsHomeRestrictionBehavior = (
  behavior: Partial<MoveTowardsHomeRestrictionBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_towards_home_restriction': any } | undefined => {
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
    'minecraft:behavior.move_towards_home_restriction': result
  };
};
