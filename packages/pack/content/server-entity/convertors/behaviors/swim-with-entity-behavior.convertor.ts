import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SwimWithEntityBehavior } from '../../interfaces/behaviors/swim-with-entity-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber, validatePercentage } from '../common/validation';

/**
 * Converts a SwimWithEntityBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwimWithEntityBehavior = (
  behavior: Partial<SwimWithEntityBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.swim_with_entity': any } | undefined => {
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

  // Validate successRate
  if (behavior.successRate !== undefined) {
    if (!validatePercentage(behavior.successRate, 'successRate')) {
      return undefined;
    }
    result.success_rate = behavior.successRate;
  }

  // Validate chanceToStop
  if (behavior.chanceToStop !== undefined) {
    if (!validatePercentage(behavior.chanceToStop, 'chanceToStop')) {
      return undefined;
    }
    result.chance_to_stop = behavior.chanceToStop;
  }

  // Validate stateCheckInterval
  if (behavior.stateCheckInterval !== undefined) {
    if (!validateNumber(behavior.stateCheckInterval, 'stateCheckInterval')) {
      return undefined;
    }
    result.state_check_interval = behavior.stateCheckInterval;
  }

  // Validate catchUpThreshold
  if (behavior.catchUpThreshold !== undefined) {
    if (!validateNumber(behavior.catchUpThreshold, 'catchUpThreshold')) {
      return undefined;
    }
    result.catch_up_threshold = behavior.catchUpThreshold;
  }

  // Validate matchDirectionThreshold
  if (behavior.matchDirectionThreshold !== undefined) {
    if (!validateNumber(behavior.matchDirectionThreshold, 'matchDirectionThreshold')) {
      return undefined;
    }
    result.match_direction_threshold = behavior.matchDirectionThreshold;
  }

  // Validate catchUpMultiplier
  if (behavior.catchUpMultiplier !== undefined) {
    if (!validateNumber(behavior.catchUpMultiplier, 'catchUpMultiplier')) {
      return undefined;
    }
    result.catch_up_multiplier = behavior.catchUpMultiplier;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateNumber(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
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
    'minecraft:behavior.swim_with_entity': result
  };
};
