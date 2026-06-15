import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OwnerHurtTargetBehavior } from '../../interfaces/behaviors/owner-hurt-target-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts an OwnerHurtTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertOwnerHurtTargetBehavior = (
  behavior: Partial<OwnerHurtTargetBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.owner_hurt_target': any } | undefined => {
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
    'minecraft:behavior.owner_hurt_target': result,
  };
};
