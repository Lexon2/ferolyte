import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DefendVillageTargetBehavior } from '../../interfaces/behaviors/defend-village-target-behavior';
import { convertSingleEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a DefendVillageTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDefendVillageTargetBehavior = (
  behavior: Partial<DefendVillageTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.defend_village_target': any } | undefined => {
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
    if (Array.isArray(behavior.entityTypes)) {
      const convertedTypes = behavior.entityTypes.map(type => convertSingleEntityDefinition(type));
      if (convertedTypes.some(type => type === undefined)) {
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

  // Validate mustReach
  if (behavior.mustReach !== undefined) {
    if (typeof behavior.mustReach !== 'boolean') {
      console.error('mustReach must be a boolean');

      return undefined;
    }
    result.must_reach = behavior.mustReach;
  }

  // Validate attackChance
  if (behavior.attackChance !== undefined) {
    if (!validateNumber(behavior.attackChance, 'attackChance')) {
      return undefined;
    }
    result.attack_chance = behavior.attackChance;
  }

  return {
    'minecraft:behavior.defend_village_target': result
  };
};
