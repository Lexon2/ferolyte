import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RangedAttackBehavior } from '../../interfaces/behaviors/ranged-attack-behavior';
import { validateNumber, validateBoolean, validateInteger } from '../common/validation';

/**
 * Converts a RangedAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRangedAttackBehavior = (
  behavior: Partial<RangedAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.ranged_attack': any } | undefined => {
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

  // Validate attackInterval
  if (behavior.attackInterval !== undefined) {
    if (!validateNumber(behavior.attackInterval, 'attackInterval')) {
      return undefined;
    }
    result.attack_interval = behavior.attackInterval;
  }

  // Validate attackIntervalMax
  if (behavior.attackIntervalMax !== undefined) {
    if (!validateNumber(behavior.attackIntervalMax, 'attackIntervalMax')) {
      return undefined;
    }
    result.attack_interval_max = behavior.attackIntervalMax;
  }

  // Validate attackIntervalMin
  if (behavior.attackIntervalMin !== undefined) {
    if (!validateNumber(behavior.attackIntervalMin, 'attackIntervalMin')) {
      return undefined;
    }
    result.attack_interval_min = behavior.attackIntervalMin;
  }

  // Validate attackRadius
  if (behavior.attackRadius !== undefined) {
    if (!validateNumber(behavior.attackRadius, 'attackRadius')) {
      return undefined;
    }
    result.attack_radius = behavior.attackRadius;
  }

  // Validate attackRadiusMin
  if (behavior.attackRadiusMin !== undefined) {
    if (!validateNumber(behavior.attackRadiusMin, 'attackRadiusMin')) {
      return undefined;
    }
    result.attack_radius_min = behavior.attackRadiusMin;
  }

  // Validate burstInterval
  if (behavior.burstInterval !== undefined) {
    if (!validateNumber(behavior.burstInterval, 'burstInterval')) {
      return undefined;
    }
    result.burst_interval = behavior.burstInterval;
  }

  // Validate burstShots
  if (behavior.burstShots !== undefined) {
    if (!validateInteger(behavior.burstShots, 'burstShots')) {
      return undefined;
    }
    result.burst_shots = behavior.burstShots;
  }

  // Validate chargeChargedTrigger
  if (behavior.chargeChargedTrigger !== undefined) {
    if (!validateNumber(behavior.chargeChargedTrigger, 'chargeChargedTrigger')) {
      return undefined;
    }
    result.charge_charged_trigger = behavior.chargeChargedTrigger;
  }

  // Validate chargeShootTrigger
  if (behavior.chargeShootTrigger !== undefined) {
    if (!validateNumber(behavior.chargeShootTrigger, 'chargeShootTrigger')) {
      return undefined;
    }
    result.charge_shoot_trigger = behavior.chargeShootTrigger;
  }

  // Validate rangedFov
  if (behavior.rangedFov !== undefined) {
    if (!validateNumber(behavior.rangedFov, 'rangedFov')) {
      return undefined;
    }
    result.ranged_fov = behavior.rangedFov;
  }

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate swing
  if (behavior.swing !== undefined) {
    if (!validateBoolean(behavior.swing, 'swing')) {
      return undefined;
    }
    result.swing = behavior.swing;
  }

  // Validate targetInSightTime
  if (behavior.targetInSightTime !== undefined) {
    if (!validateNumber(behavior.targetInSightTime, 'targetInSightTime')) {
      return undefined;
    }
    result.target_in_sight_time = behavior.targetInSightTime;
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
    'minecraft:behavior.ranged_attack': result
  };
};
