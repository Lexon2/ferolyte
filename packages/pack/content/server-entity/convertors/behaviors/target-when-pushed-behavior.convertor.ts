import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TargetWhenPushedBehavior } from '../../interfaces/behaviors/target-when-pushed-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a TargetWhenPushedBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTargetWhenPushedBehavior = (
  behavior: Partial<TargetWhenPushedBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.target_when_pushed': any } | undefined => {
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

  // Validate percentChance
  if (behavior.percentChance !== undefined) {
    if (!validateNumber(behavior.percentChance, 'percentChance')) {
      return undefined;
    }
    result.percent_chance = behavior.percentChance;
  }

  return {
    'minecraft:behavior.target_when_pushed': result
  };
};
