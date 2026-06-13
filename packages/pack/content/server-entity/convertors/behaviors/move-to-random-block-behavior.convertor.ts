import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MoveToRandomBlockBehavior } from '../../interfaces/behaviors/move-to-random-block-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveToRandomBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveToRandomBlockBehavior = (
  behavior: Partial<MoveToRandomBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_to_random_block': any } | undefined => {
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

  // Validate blockDistance
  if (behavior.blockDistance !== undefined) {
    if (!validateNumber(behavior.blockDistance, 'blockDistance')) {
      return undefined;
    }
    result.block_distance = behavior.blockDistance;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.move_to_random_block': result
  };
};
