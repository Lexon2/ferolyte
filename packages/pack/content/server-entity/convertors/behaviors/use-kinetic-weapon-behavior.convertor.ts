import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { UseKineticWeaponBehavior } from '../../interfaces/behaviors/use-kinetic-weapon-behavior';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
} from '../common/validation';

/**
 * Converts a UseKineticWeaponBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertUseKineticWeaponBehavior = (
  behavior: Partial<UseKineticWeaponBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.use_kinetic_weapon': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority', 0, undefined, ctx)) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  if (behavior.approachDistance !== undefined) {
    if (!validateNumber(behavior.approachDistance, 'approachDistance', undefined, undefined, ctx)) {
      return undefined;
    }
    result.approach_distance = behavior.approachDistance;
  }

  if (behavior.repositionDistance !== undefined) {
    if (!validateNumber(behavior.repositionDistance, 'repositionDistance', undefined, undefined, ctx)) {
      return undefined;
    }
    result.reposition_distance = behavior.repositionDistance;
  }

  if (behavior.cooldownDistance !== undefined) {
    if (!validateNumber(behavior.cooldownDistance, 'cooldownDistance', undefined, undefined, ctx)) {
      return undefined;
    }
    result.cooldown_distance = behavior.cooldownDistance;
  }

  if (behavior.repositionSpeedMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.repositionSpeedMultiplier,
        'repositionSpeedMultiplier',
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.reposition_speed_multiplier = behavior.repositionSpeedMultiplier;
  }

  if (behavior.cooldownSpeedMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.cooldownSpeedMultiplier,
        'cooldownSpeedMultiplier',
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.cooldown_speed_multiplier = behavior.cooldownSpeedMultiplier;
  }

  if (behavior.weaponReachMultiplier !== undefined) {
    if (!validateNumber(behavior.weaponReachMultiplier, 'weaponReachMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.weapon_reach_multiplier = behavior.weaponReachMultiplier;
  }

  if (behavior.weaponMinSpeedMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.weaponMinSpeedMultiplier,
        'weaponMinSpeedMultiplier',
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.weapon_min_speed_multiplier = behavior.weaponMinSpeedMultiplier;
  }

  if (behavior.maxPathTime !== undefined) {
    if (!validateNumber(behavior.maxPathTime, 'maxPathTime', undefined, undefined, ctx)) {
      return undefined;
    }
    result.max_path_time = behavior.maxPathTime;
  }

  if (behavior.meleeFov !== undefined) {
    if (!validateNumber(behavior.meleeFov, 'meleeFov', undefined, undefined, ctx)) {
      return undefined;
    }
    result.melee_fov = behavior.meleeFov;
  }

  if (behavior.minPathTime !== undefined) {
    if (!validateNumber(behavior.minPathTime, 'minPathTime', undefined, undefined, ctx)) {
      return undefined;
    }
    result.min_path_time = behavior.minPathTime;
  }

  if (behavior.outerBoundaryTimeIncrease !== undefined) {
    if (
      !validateNumber(
        behavior.outerBoundaryTimeIncrease,
        'outerBoundaryTimeIncrease',
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.outer_boundary_time_increase = behavior.outerBoundaryTimeIncrease;
  }

  if (behavior.pathFailTimeIncrease !== undefined) {
    if (!validateNumber(behavior.pathFailTimeIncrease, 'pathFailTimeIncrease', undefined, undefined, ctx)) {
      return undefined;
    }
    result.path_fail_time_increase = behavior.pathFailTimeIncrease;
  }

  if (behavior.pathInnerBoundary !== undefined) {
    if (!validateNumber(behavior.pathInnerBoundary, 'pathInnerBoundary', undefined, undefined, ctx)) {
      return undefined;
    }
    result.path_inner_boundary = behavior.pathInnerBoundary;
  }

  if (behavior.pathOuterBoundary !== undefined) {
    if (!validateNumber(behavior.pathOuterBoundary, 'pathOuterBoundary', undefined, undefined, ctx)) {
      return undefined;
    }
    result.path_outer_boundary = behavior.pathOuterBoundary;
  }

  if (behavior.requireCompletePath !== undefined) {
    if (!validateBoolean(behavior.requireCompletePath, 'requireCompletePath', ctx)) {
      return undefined;
    }
    result.require_complete_path = behavior.requireCompletePath;
  }

  if (behavior.trackTarget !== undefined) {
    if (!validateBoolean(behavior.trackTarget, 'trackTarget', ctx)) {
      return undefined;
    }
    result.track_target = behavior.trackTarget;
  }

  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime', undefined, undefined, ctx)) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  if (behavior.xMaxRotation !== undefined) {
    if (!validateNumber(behavior.xMaxRotation, 'xMaxRotation', undefined, undefined, ctx)) {
      return undefined;
    }
    result.x_max_rotation = behavior.xMaxRotation;
  }

  if (behavior.yMaxHeadRotation !== undefined) {
    if (!validateNumber(behavior.yMaxHeadRotation, 'yMaxHeadRotation', undefined, undefined, ctx)) {
      return undefined;
    }
    result.y_max_head_rotation = behavior.yMaxHeadRotation;
  }

  if (behavior.randomStopInterval !== undefined) {
    if (!validateInteger(behavior.randomStopInterval, 'randomStopInterval', 0, undefined, ctx)) {
      return undefined;
    }
    result.random_stop_interval = behavior.randomStopInterval;
  }

  if (behavior.attackOnce !== undefined) {
    if (!validateBoolean(behavior.attackOnce, 'attackOnce', ctx)) {
      return undefined;
    }
    result.attack_once = behavior.attackOnce;
  }

  if (behavior.hijackMountNavigation !== undefined) {
    if (!validateBoolean(behavior.hijackMountNavigation, 'hijackMountNavigation', ctx)) {
      return undefined;
    }
    result.hijack_mount_navigation = behavior.hijackMountNavigation;
  }

  return {
    'minecraft:behavior.use_kinetic_weapon': result,
  };
};
