import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SwimWanderBehavior } from '../../interfaces/behaviors/swim-wander-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SwimWanderBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwimWanderBehavior = (
  behavior: Partial<SwimWanderBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.swim_wander': any } | undefined => {
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

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateNumber(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
  }

  // Validate lookAhead
  if (behavior.lookAhead !== undefined) {
    if (!validateNumber(behavior.lookAhead, 'lookAhead')) {
      return undefined;
    }
    result.look_ahead = behavior.lookAhead;
  }

  // Validate wanderTime
  if (behavior.wanderTime !== undefined) {
    if (!validateNumber(behavior.wanderTime, 'wanderTime')) {
      return undefined;
    }
    result.wander_time = behavior.wanderTime;
  }

  return {
    'minecraft:behavior.swim_wander': result,
  };
};
