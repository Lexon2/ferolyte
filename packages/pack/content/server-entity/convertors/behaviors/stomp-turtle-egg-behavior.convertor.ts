import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { StompTurtleEggBehavior } from '../../interfaces/behaviors/stomp-turtle-egg-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a StompTurtleEggBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStompTurtleEggBehavior = (
  behavior: Partial<StompTurtleEggBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.stomp_turtle_egg': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateInteger(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateInteger(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  return {
    'minecraft:behavior.stomp_turtle_egg': result,
  };
};
