import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FollowParentBehavior } from '../../interfaces/behaviors/follow-parent-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a FollowParentBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowParentBehavior = (
  behavior: Partial<FollowParentBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.follow_parent': any } | undefined => {
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
    'minecraft:behavior.follow_parent': result,
  };
};
