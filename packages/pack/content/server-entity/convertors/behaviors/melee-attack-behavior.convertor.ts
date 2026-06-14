import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MeleeAttackBehavior } from '../../interfaces/behaviors/melee-attack-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateString,
  validateNumber,
  validateInteger,
} from '../common/validation';

/**
 * Converts a MeleeAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMeleeAttackBehavior = (
  behavior: Partial<MeleeAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.melee_attack': any } | undefined => {
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

  // Validate attackOnce
  if (behavior.attackOnce !== undefined) {
    if (!validateBoolean(behavior.attackOnce, 'attackOnce')) {
      return undefined;
    }
    result.attack_once = behavior.attackOnce;
  }

  // Validate attackTypes
  if (behavior.attackTypes !== undefined) {
    if (!validateString(behavior.attackTypes, 'attackTypes')) {
      return undefined;
    }
    result.attack_types = behavior.attackTypes;
  }

  // Validate canSpreadOnFire
  if (behavior.canSpreadOnFire !== undefined) {
    if (!validateBoolean(behavior.canSpreadOnFire, 'canSpreadOnFire')) {
      return undefined;
    }
    result.can_spread_on_fire = behavior.canSpreadOnFire;
  }

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate innerBoundaryTimeIncrease
  if (behavior.innerBoundaryTimeIncrease !== undefined) {
    if (
      !validateNumber(
        behavior.innerBoundaryTimeIncrease,
        'innerBoundaryTimeIncrease',
      )
    ) {
      return undefined;
    }
    result.inner_boundary_time_increase = behavior.innerBoundaryTimeIncrease;
  }

  // Validate maxPathTime
  if (behavior.maxPathTime !== undefined) {
    if (!validateNumber(behavior.maxPathTime, 'maxPathTime')) {
      return undefined;
    }
    result.max_path_time = behavior.maxPathTime;
  }

  // Validate meleeFov
  if (behavior.meleeFov !== undefined) {
    if (!validateNumber(behavior.meleeFov, 'meleeFov')) {
      return undefined;
    }
    result.melee_fov = behavior.meleeFov;
  }

  // Validate minPathTime
  if (behavior.minPathTime !== undefined) {
    if (!validateNumber(behavior.minPathTime, 'minPathTime')) {
      return undefined;
    }
    result.min_path_time = behavior.minPathTime;
  }

  // Validate onAttack
  if (behavior.onAttack !== undefined) {
    const convertedOnAttack = convertTrigger(behavior.onAttack, withFieldPath(ctx, 'onAttack'));
    if (!convertedOnAttack) {
      return undefined;
    }
    result.on_attack = convertedOnAttack;
  }

  // Validate onKill
  if (behavior.onKill !== undefined) {
    const convertedOnKill = convertTrigger(behavior.onKill, withFieldPath(ctx, 'onKill'));
    if (!convertedOnKill) {
      return undefined;
    }
    result.on_kill = convertedOnKill;
  }

  // Validate outerBoundaryTimeIncrease
  if (behavior.outerBoundaryTimeIncrease !== undefined) {
    if (
      !validateNumber(
        behavior.outerBoundaryTimeIncrease,
        'outerBoundaryTimeIncrease',
      )
    ) {
      return undefined;
    }
    result.outer_boundary_time_increase = behavior.outerBoundaryTimeIncrease;
  }

  // Validate pathFailTimeIncrease
  if (behavior.pathFailTimeIncrease !== undefined) {
    if (
      !validateNumber(behavior.pathFailTimeIncrease, 'pathFailTimeIncrease')
    ) {
      return undefined;
    }
    result.path_fail_time_increase = behavior.pathFailTimeIncrease;
  }

  // Validate pathInnerBoundary
  if (behavior.pathInnerBoundary !== undefined) {
    if (!validateNumber(behavior.pathInnerBoundary, 'pathInnerBoundary')) {
      return undefined;
    }
    result.path_inner_boundary = behavior.pathInnerBoundary;
  }

  // Validate pathOuterBoundary
  if (behavior.pathOuterBoundary !== undefined) {
    if (!validateNumber(behavior.pathOuterBoundary, 'pathOuterBoundary')) {
      return undefined;
    }
    result.path_outer_boundary = behavior.pathOuterBoundary;
  }

  // Validate randomStopInterval
  if (behavior.randomStopInterval !== undefined) {
    if (!validateInteger(behavior.randomStopInterval, 'randomStopInterval')) {
      return undefined;
    }
    result.random_stop_interval = behavior.randomStopInterval;
  }

  // Validate reachMultiplier
  if (behavior.reachMultiplier !== undefined) {
    if (!validateNumber(behavior.reachMultiplier, 'reachMultiplier')) {
      return undefined;
    }
    result.reach_multiplier = behavior.reachMultiplier;
  }

  // Validate requireCompletePath
  if (behavior.requireCompletePath !== undefined) {
    if (!validateBoolean(behavior.requireCompletePath, 'requireCompletePath')) {
      return undefined;
    }
    result.require_complete_path = behavior.requireCompletePath;
  }

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate trackTarget
  if (behavior.trackTarget !== undefined) {
    if (!validateBoolean(behavior.trackTarget, 'trackTarget')) {
      return undefined;
    }
    result.track_target = behavior.trackTarget;
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
    'minecraft:behavior.melee_attack': result,
  };
};
