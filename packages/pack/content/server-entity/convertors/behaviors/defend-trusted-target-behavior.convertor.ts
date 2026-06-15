import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DefendTrustedTargetBehavior } from '../../interfaces/behaviors/defend-trusted-target-behavior';
import { convertSingleEntityDefinition } from '../common/entity-definition.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a DefendTrustedTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDefendTrustedTargetBehavior = (
  behavior: Partial<DefendTrustedTargetBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.defend_trusted_target': any } | undefined => {
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

  // Validate aggroSound
  if (behavior.aggroSound !== undefined) {
    if (typeof behavior.aggroSound !== 'string') {
      console.error('aggroSound must be a string');

      return undefined;
    }
    result.aggro_sound = behavior.aggroSound;
  }

  // Validate attackInterval
  if (behavior.attackInterval !== undefined) {
    if (!validateNumber(behavior.attackInterval, 'attackInterval')) {
      return undefined;
    }
    result.attack_interval = behavior.attackInterval;
  }

  // Validate mustSee
  if (behavior.mustSee !== undefined) {
    if (typeof behavior.mustSee !== 'boolean') {
      console.error('mustSee must be a boolean');

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

  // Validate onDefendStart
  if (behavior.onDefendStart !== undefined) {
    const convertedOnDefendStart = convertTrigger(
      behavior.onDefendStart,
      withFieldPath(ctx, 'onDefendStart'),
    );
    if (!convertedOnDefendStart) {
      return undefined;
    }
    result.on_defend_start = convertedOnDefendStart;
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

  // Validate soundChance
  if (behavior.soundChance !== undefined) {
    if (!validateNumber(behavior.soundChance, 'soundChance')) {
      return undefined;
    }
    result.sound_chance = behavior.soundChance;
  }

  return {
    'minecraft:behavior.defend_trusted_target': result,
  };
};
