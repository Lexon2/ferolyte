import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { OwnerHurtByTargetBehavior } from '../../interfaces/behaviors/owner-hurt-by-target-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts an OwnerHurtByTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertOwnerHurtByTargetBehavior = (
  behavior: Partial<OwnerHurtByTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.owner_hurt_by_target': any } | undefined => {
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
    'minecraft:behavior.owner_hurt_by_target': result
  };
};
