import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { ShareItemsBehavior } from '../../interfaces/behaviors/share-items-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a ShareItemsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertShareItemsBehavior = (
  behavior: Partial<ShareItemsBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.share_items': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate maxDist
  if (behavior.maxDist !== undefined) {
    if (!validateNumber(behavior.maxDist, 'maxDist')) {
      return undefined;
    }
    result.max_dist = behavior.maxDist;
  }

  return {
    'minecraft:behavior.share_items': result
  };
};
