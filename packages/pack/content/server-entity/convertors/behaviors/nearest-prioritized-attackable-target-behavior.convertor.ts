import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { NearestPrioritizedAttackableTargetBehavior } from '../../interfaces/behaviors/nearest-prioritized-attackable-target-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateBoolean, validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a NearestPrioritizedAttackableTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertNearestPrioritizedAttackableTargetBehavior = (
  behavior: Partial<NearestPrioritizedAttackableTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.nearest_prioritized_attackable_target': any } | undefined => {
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

  // Validate attackInterval
  if (behavior.attackInterval !== undefined) {
    if (!validateInteger(behavior.attackInterval, 'attackInterval')) {
      return undefined;
    }
    result.attack_interval = behavior.attackInterval;
  }

  // Validate cooldown
  if (behavior.cooldown !== undefined) {
    if (!validateNumber(behavior.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = behavior.cooldown;
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
    if (!validateNumber(behavior.mustSeeForgetDuration, 'mustSeeForgetDuration')) {
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

  // Validate reevaluateDescription
  if (behavior.reevaluateDescription !== undefined) {
    if (!validateBoolean(behavior.reevaluateDescription, 'reevaluateDescription')) {
      return undefined;
    }
    result.reevaluate_description = behavior.reevaluateDescription;
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

  // Validate targetSearchHeight
  if (behavior.targetSearchHeight !== undefined) {
    if (!validateNumber(behavior.targetSearchHeight, 'targetSearchHeight')) {
      return undefined;
    }
    result.target_search_height = behavior.targetSearchHeight;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.nearest_prioritized_attackable_target': result
  };
};
