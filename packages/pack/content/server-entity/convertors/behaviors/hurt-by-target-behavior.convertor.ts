import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { HurtByTargetBehavior } from '../../interfaces/behaviors/hurt-by-target-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a HurtByTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertHurtByTargetBehavior = (
  behavior: Partial<HurtByTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.hurt_by_target': any } | undefined => {
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
    const convertedTypes = convertEntityDefinition(
      behavior.entityTypes,
      withFieldPath(ctx, 'entityTypes'),
    );
    if (!convertedTypes) {
      return undefined;
    }
    result.entity_types = convertedTypes;
  }

  // Validate alertSameType
  if (behavior.alertSameType !== undefined) {
    if (!validateBoolean(behavior.alertSameType, 'alertSameType')) {
      return undefined;
    }
    result.alert_same_type = behavior.alertSameType;
  }

  // Validate hurtOwner
  if (behavior.hurtOwner !== undefined) {
    if (!validateBoolean(behavior.hurtOwner, 'hurtOwner')) {
      return undefined;
    }
    result.hurt_owner = behavior.hurtOwner;
  }

  return {
    'minecraft:behavior.hurt_by_target': result,
  };
};
