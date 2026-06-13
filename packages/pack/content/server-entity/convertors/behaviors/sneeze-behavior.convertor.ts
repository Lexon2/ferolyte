import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SneezeBehavior } from '../../interfaces/behaviors/sneeze-behavior';
import { convertEntityDefinition } from '../common/entity-definition.convertor';
import { validateNumber, validatePercentage, validateSoundEvent, validateTradeOrLootTablePath } from '../common/validation';

/**
 * Converts a SneezeBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSneezeBehavior = (
  behavior: Partial<SneezeBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.sneeze': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate dropItemChance
  if (behavior.dropItemChance !== undefined) {
    if (!validatePercentage(behavior.dropItemChance, 'dropItemChance')) {
      return undefined;
    }
    result.drop_item_chance = behavior.dropItemChance;
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

  // Validate lootTable
  if (behavior.lootTable !== undefined) {
    if (!validateTradeOrLootTablePath(behavior.lootTable, 'lootTable')) {
      return undefined;
    }
    result.loot_table = behavior.lootTable;
  }

  // Validate prepareSound
  if (behavior.prepareSound !== undefined) {
    if (!validateSoundEvent(behavior.prepareSound, 'prepareSound')) {
      return undefined;
    }
    result.prepare_sound = behavior.prepareSound;
  }

  // Validate prepareTime
  if (behavior.prepareTime !== undefined) {
    if (!validateNumber(behavior.prepareTime, 'prepareTime')) {
      return undefined;
    }
    result.prepare_time = behavior.prepareTime;
  }

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  // Validate sound
  if (behavior.sound !== undefined) {
    if (!validateSoundEvent(behavior.sound, 'sound')) {
      return undefined;
    }
    result.sound = behavior.sound;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.sneeze': result
  };
};
