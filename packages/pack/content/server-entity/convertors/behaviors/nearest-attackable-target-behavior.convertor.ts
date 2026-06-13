import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import { NearestAttackableTargetBehavior } from '../../interfaces/behaviors/nearest-attackable-target-behavior';
import {
  convertEntityDefinition,
} from '../common/entity-definition.convertor';
import {
  validateNumber,
  validateBoolean,
  validateInteger,
} from '../common/validation';

/**
 * Converts a NearestAttackableTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertNearestAttackableTargetBehavior = (
  behavior: Partial<NearestAttackableTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.nearest_attackable_target': any } | undefined => {
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

  // Validate attackInterval
  if (behavior.attackInterval !== undefined) {
    if (!validateInteger(behavior.attackInterval, 'attackInterval')) {
      return undefined;
    }
    result.attack_interval = behavior.attackInterval;
  }

  // Validate attackIntervalMin
  if (behavior.attackIntervalMin !== undefined) {
    if (!validateNumber(behavior.attackIntervalMin, 'attackIntervalMin')) {
      return undefined;
    }
    result.attack_interval_min = behavior.attackIntervalMin;
  }

  // Validate attackOwner
  if (behavior.attackOwner !== undefined) {
    if (!validateBoolean(behavior.attackOwner, 'attackOwner')) {
      return undefined;
    }
    result.attack_owner = behavior.attackOwner;
  }

  // Validate mustReach
  if (behavior.mustReach !== undefined) {
    if (!validateBoolean(behavior.mustReach, 'mustReach')) {
      return undefined;
    }
    result.must_reach = behavior.mustReach;
  }

  // Validate mustSee
  if (behavior.mustSee !== undefined) {
    if (!validateBoolean(behavior.mustSee, 'mustSee')) {
      return undefined;
    }
    result.must_see = behavior.mustSee;
  }

  // Validate mustSeeForgetDuration
  if (behavior.mustSeeForgetDuration !== undefined) {
    if (
      !validateNumber(behavior.mustSeeForgetDuration, 'mustSeeForgetDuration')
    ) {
      return undefined;
    }
    result.must_see_forget_duration = behavior.mustSeeForgetDuration;
  }

  // Validate persistTime
  if (behavior.persistTime !== undefined) {
    if (!validateNumber(behavior.persistTime, 'persistTime')) {
      return undefined;
    }
    result.persist_time = behavior.persistTime;
  }

  // Validate reselectTargets
  if (behavior.reselectTargets !== undefined) {
    if (!validateBoolean(behavior.reselectTargets, 'reselectTargets')) {
      return undefined;
    }
    result.reselect_targets = behavior.reselectTargets;
  }

  // Validate scanInterval
  if (behavior.scanInterval !== undefined) {
    if (!validateInteger(behavior.scanInterval, 'scanInterval')) {
      return undefined;
    }
    result.scan_interval = behavior.scanInterval;
  }

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate targetInvisibleMultiplier
  if (behavior.targetInvisibleMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.targetInvisibleMultiplier,
        'targetInvisibleMultiplier',
      )
    ) {
      return undefined;
    }
    result.target_invisible_multiplier = behavior.targetInvisibleMultiplier;
  }

  // Validate targetSearchHeight
  if (behavior.targetSearchHeight !== undefined) {
    if (!validateNumber(behavior.targetSearchHeight, 'targetSearchHeight')) {
      return undefined;
    }
    result.target_search_height = behavior.targetSearchHeight;
  }

  // Validate targetSneakVisibilityMultiplier
  if (behavior.targetSneakVisibilityMultiplier !== undefined) {
    if (
      !validateNumber(
        behavior.targetSneakVisibilityMultiplier,
        'targetSneakVisibilityMultiplier',
      )
    ) {
      return undefined;
    }
    result.target_sneak_visibility_multiplier =
      behavior.targetSneakVisibilityMultiplier;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  // Validate entityTypes
  if (behavior.entityTypes !== undefined) {
    const convertedEntityTypes = convertEntityDefinition(
      behavior.entityTypes,
      withFieldPath(ctx, 'entityTypes'),
    );
    if (!convertedEntityTypes) {
      return undefined;
    }
    result.entity_types = convertedEntityTypes;
  }

  return {
    'minecraft:behavior.nearest_attackable_target': result,
  };
};
