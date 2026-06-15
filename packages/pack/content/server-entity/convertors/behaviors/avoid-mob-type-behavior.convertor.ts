import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { AvoidMobTypeBehavior } from '../../interfaces/behaviors/avoid-mob-type-behavior';
import { convertRange } from '../common/convertors';
import { convertSingleEntityDefinition } from '../common/entity-definition.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
  validatePercentage,
} from '../common/validation';

/**
 * Converts an AvoidMobTypeBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertAvoidMobTypeBehavior = (
  behavior: Partial<AvoidMobTypeBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.avoid_mob_type': any } | undefined => {
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

  // Validate avoidMobSound
  if (behavior.avoidMobSound !== undefined) {
    if (typeof behavior.avoidMobSound !== 'string') {
      console.error('avoidMobSound must be a string');

      return undefined;
    }
    result.avoid_mob_sound = behavior.avoidMobSound;
  }

  // Validate avoidTargetXz
  if (behavior.avoidTargetXz !== undefined) {
    if (!validateNumber(behavior.avoidTargetXz, 'avoidTargetXz')) {
      return undefined;
    }
    result.avoid_target_xz = behavior.avoidTargetXz;
  }

  // Validate avoidTargetY
  if (behavior.avoidTargetY !== undefined) {
    if (!validateNumber(behavior.avoidTargetY, 'avoidTargetY')) {
      return undefined;
    }
    result.avoid_target_y = behavior.avoidTargetY;
  }

  // Validate ignoreVisibilty
  if (behavior.ignoreVisibilty !== undefined) {
    if (typeof behavior.ignoreVisibilty !== 'boolean') {
      console.error('ignoreVisibilty must be a boolean');

      return undefined;
    }
    result.ignore_visibilty = behavior.ignoreVisibilty;
  }

  // Validate maxDist
  if (behavior.maxDist !== undefined) {
    if (!validateNumber(behavior.maxDist, 'maxDist')) {
      return undefined;
    }
    result.max_dist = behavior.maxDist;
  }

  // Validate maxFlee
  if (behavior.maxFlee !== undefined) {
    if (!validateNumber(behavior.maxFlee, 'maxFlee')) {
      return undefined;
    }
    result.max_flee = behavior.maxFlee;
  }

  // Validate probabilityPerStrength
  if (behavior.probabilityPerStrength !== undefined) {
    if (
      !validatePercentage(
        behavior.probabilityPerStrength,
        'probabilityPerStrength',
      )
    ) {
      return undefined;
    }
    result.probability_per_strength = behavior.probabilityPerStrength;
  }

  // Validate removeTarget
  if (behavior.removeTarget !== undefined) {
    if (typeof behavior.removeTarget !== 'boolean') {
      console.error('removeTarget must be a boolean');

      return undefined;
    }
    result.remove_target = behavior.removeTarget;
  }

  // Validate sprintDistance
  if (behavior.sprintDistance !== undefined) {
    if (!validateNumber(behavior.sprintDistance, 'sprintDistance')) {
      return undefined;
    }
    result.sprint_distance = behavior.sprintDistance;
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

  // Validate ignoreVisibility
  if (behavior.ignoreVisibility !== undefined) {
    if (!validateBoolean(behavior.ignoreVisibility, 'ignoreVisibility')) {
      return undefined;
    }
    result.ignore_visibility = behavior.ignoreVisibility;
  }

  // Validate entityTypes
  if (behavior.entityTypes !== undefined) {
    if (Array.isArray(behavior.entityTypes)) {
      const convertedTypes = behavior.entityTypes.map((type) =>
        convertSingleEntityDefinition(type),
      );
      if (convertedTypes.some((type) => type === undefined)) {
        return undefined;
      }
      result.entity_types = convertedTypes;
    } else {
      const convertedType = convertSingleEntityDefinition(behavior.entityTypes);
      if (!convertedType) {
        return undefined;
      }
      result.entity_types = convertedType;
    }
  }

  // Validate onEscapeEvent
  if (behavior.onEscapeEvent !== undefined) {
    const onEscapeEvent = convertTrigger(
      behavior.onEscapeEvent,
      withFieldPath(ctx, 'onEscapeEvent'),
    );
    if (!onEscapeEvent) {
      return undefined;
    }
    result.on_escape_event = onEscapeEvent;
  }

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    const convertedInterval = convertRange(
      behavior.soundInterval,
      'soundInterval',
    );
    if (!convertedInterval) {
      return undefined;
    }
    result.sound_interval = convertedInterval;
  }

  return {
    'minecraft:behavior.avoid_mob_type': result,
  };
};
