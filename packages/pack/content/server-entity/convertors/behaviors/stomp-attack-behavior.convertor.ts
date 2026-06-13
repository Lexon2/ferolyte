import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { StompAttackBehavior } from '../../interfaces/behaviors/stomp-attack-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateNumber,
  validateBoolean,
  validateString,
} from '../common/validation';

/**
 * Converts a StompAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStompAttackBehavior = (
  behavior: Partial<StompAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.stomp_attack': any } | undefined => {
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

  // Validate maxDist
  if (behavior.maxDist !== undefined) {
    if (!validateNumber(behavior.maxDist, 'maxDist')) {
      return undefined;
    }
    result.max_dist = behavior.maxDist;
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

  // Validate noDamageRangeMultiplier
  if (behavior.noDamageRangeMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.noDamageRangeMultiplier,
        'noDamageRangeMultiplier',
      )
    ) {
      return undefined;
    }
    result.no_damage_range_multiplier = behavior.noDamageRangeMultiplier;
  }

  // Validate onAttack
  if (behavior.onAttack !== undefined) {
    const convertedTrigger = convertTrigger(behavior.onAttack, withFieldPath(ctx, 'onAttack'));
    if (!convertedTrigger) {
      return undefined;
    }
    result.on_attack = convertedTrigger;
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
    if (!validateNumber(behavior.pathFailTimeIncrease, 'pathFailTimeIncrease')) {
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
    if (!validateNumber(behavior.randomStopInterval, 'randomStopInterval')) {
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

  // Validate stompRangeMultiplier
  if (behavior.stompRangeMultiplier !== undefined) {
    if (
      !validateNumber(behavior.stompRangeMultiplier, 'stompRangeMultiplier')
    ) {
      return undefined;
    }
    result.stomp_range_multiplier = behavior.stompRangeMultiplier;
  }

  // Validate targetDist
  if (behavior.targetDist !== undefined) {
    if (!validateNumber(behavior.targetDist, 'targetDist')) {
      return undefined;
    }
    result.target_dist = behavior.targetDist;
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
    'minecraft:behavior.stomp_attack': result,
  };
};
