import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OcelotAttackBehavior } from '../../interfaces/behaviors/ocelot-attack-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an OcelotAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertOcelotAttackBehavior = (
  behavior: Partial<OcelotAttackBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.ocelotattack': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate maxDistance
  if (behavior.maxDistance !== undefined) {
    if (!validateNumber(behavior.maxDistance, 'maxDistance')) {
      return undefined;
    }
    result.max_distance = behavior.maxDistance;
  }

  // Validate maxSneakRange
  if (behavior.maxSneakRange !== undefined) {
    if (!validateNumber(behavior.maxSneakRange, 'maxSneakRange')) {
      return undefined;
    }
    result.max_sneak_range = behavior.maxSneakRange;
  }

  // Validate maxSprintRange
  if (behavior.maxSprintRange !== undefined) {
    if (!validateNumber(behavior.maxSprintRange, 'maxSprintRange')) {
      return undefined;
    }
    result.max_sprint_range = behavior.maxSprintRange;
  }

  // Validate reachMultiplier
  if (behavior.reachMultiplier !== undefined) {
    if (!validateNumber(behavior.reachMultiplier, 'reachMultiplier')) {
      return undefined;
    }
    result.reach_multiplier = behavior.reachMultiplier;
  }

  // Validate sneakSpeedMultiplier
  if (behavior.sneakSpeedMultiplier !== undefined) {
    if (
      !validateNumber(behavior.sneakSpeedMultiplier, 'sneakSpeedMultiplier')
    ) {
      return undefined;
    }
    result.sneak_speed_multiplier = behavior.sneakSpeedMultiplier;
  }

  // Validate sprintSpeedMultiplier
  if (behavior.sprintSpeedMultiplier !== undefined) {
    if (
      !validateNumber(behavior.sprintSpeedMultiplier, 'sprintSpeedMultiplier')
    ) {
      return undefined;
    }
    result.sprint_speed_multiplier = behavior.sprintSpeedMultiplier;
  }

  // Validate walkSpeedMultiplier
  if (behavior.walkSpeedMultiplier !== undefined) {
    if (!validateNumber(behavior.walkSpeedMultiplier, 'walkSpeedMultiplier')) {
      return undefined;
    }
    result.walk_speed_multiplier = behavior.walkSpeedMultiplier;
  }

  // Validate xMaxRotation
  if (behavior.xMaxRotation !== undefined) {
    if (!validateNumber(behavior.xMaxRotation, 'xMaxRotation')) {
      return undefined;
    }
    result.x_max_rotation = behavior.xMaxRotation;
  }

  // Validate yMaxHeadRotation
  if (behavior.yMaxHeadRotation !== undefined) {
    if (!validateNumber(behavior.yMaxHeadRotation, 'yMaxHeadRotation')) {
      return undefined;
    }
    result.y_max_head_rotation = behavior.yMaxHeadRotation;
  }

  return {
    'minecraft:behavior.ocelotattack': result,
  };
};
