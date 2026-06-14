import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SleepBehavior } from '../../interfaces/behaviors/sleep-behavior';
import { validateNumber, validateBoolean } from '../common/validation';

/**
 * Converts a SleepBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSleepBehavior = (
  behavior: Partial<SleepBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.sleep': any } | undefined => {
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

  // Validate canSleepWhileRiding
  if (behavior.canSleepWhileRiding !== undefined) {
    if (!validateBoolean(behavior.canSleepWhileRiding, 'canSleepWhileRiding')) {
      return undefined;
    }
    result.can_sleep_while_riding = behavior.canSleepWhileRiding;
  }

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate sleepColliderHeight
  if (behavior.sleepColliderHeight !== undefined) {
    if (!validateNumber(behavior.sleepColliderHeight, 'sleepColliderHeight')) {
      return undefined;
    }
    result.sleep_collider_height = behavior.sleepColliderHeight;
  }

  // Validate sleepColliderWidth
  if (behavior.sleepColliderWidth !== undefined) {
    if (!validateNumber(behavior.sleepColliderWidth, 'sleepColliderWidth')) {
      return undefined;
    }
    result.sleep_collider_width = behavior.sleepColliderWidth;
  }

  // Validate sleepYOffset
  if (behavior.sleepYOffset !== undefined) {
    if (!validateNumber(behavior.sleepYOffset, 'sleepYOffset')) {
      return undefined;
    }
    result.sleep_y_offset = behavior.sleepYOffset;
  }

  // Validate timeoutCooldown
  if (behavior.timeoutCooldown !== undefined) {
    if (!validateNumber(behavior.timeoutCooldown, 'timeoutCooldown')) {
      return undefined;
    }
    result.timeout_cooldown = behavior.timeoutCooldown;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  return {
    'minecraft:behavior.sleep': result
  };
};
