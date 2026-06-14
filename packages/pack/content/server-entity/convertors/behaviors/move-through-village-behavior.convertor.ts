import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MoveThroughVillageBehavior } from '../../interfaces/behaviors/move-through-village-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a MoveThroughVillageBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveThroughVillageBehavior = (
  behavior: Partial<MoveThroughVillageBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_through_village': any } | undefined => {
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

  // Validate onlyAtNight
  if (behavior.onlyAtNight !== undefined) {
    if (!validateBoolean(behavior.onlyAtNight, 'onlyAtNight')) {
      return undefined;
    }
    result.only_at_night = behavior.onlyAtNight;
  }

  return {
    'minecraft:behavior.move_through_village': result,
  };
};
