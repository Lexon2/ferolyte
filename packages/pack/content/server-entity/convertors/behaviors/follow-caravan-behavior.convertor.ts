import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FollowCaravanBehavior } from '../../interfaces/behaviors/follow-caravan-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a FollowCaravanBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFollowCaravanBehavior = (
  behavior: Partial<FollowCaravanBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.follow_caravan': any } | undefined => {
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

  // Validate entityCount
  if (behavior.entityCount !== undefined) {
    if (!validateNumber(behavior.entityCount, 'entityCount')) {
      return undefined;
    }
    result.entity_count = behavior.entityCount;
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
    'minecraft:behavior.follow_caravan': result,
  };
};
