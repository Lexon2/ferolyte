import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { VexCopyOwnerTargetBehavior } from '../../interfaces/behaviors/vex-copy-owner-target-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a VexCopyOwnerTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertVexCopyOwnerTargetBehavior = (
  behavior: Partial<VexCopyOwnerTargetBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.vex_copy_owner_target': any } | undefined => {
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
    'minecraft:behavior.vex_copy_owner_target': result,
  };
};
