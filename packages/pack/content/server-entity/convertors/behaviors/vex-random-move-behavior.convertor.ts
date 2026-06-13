import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import { VexRandomMoveBehavior } from '../../interfaces/behaviors/vex-random-move-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a VexRandomMoveBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertVexRandomMoveBehavior = (
  behavior: Partial<VexRandomMoveBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.vex_random_move': any } | undefined => {
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

  return {
    'minecraft:behavior.vex_random_move': result
  };
};
