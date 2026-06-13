import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SpawnOnDeathComponent } from '../../../interfaces/components/miscellaneous/spawn-on-death-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateAllowedValues,
  validateBoolean,
  validateInteger,
  validateNumber,
  validateString,
} from '../../common/validation';

const SPAWN_METHODS = ['born', 'spawned', 'summoned'] as const;

/**
 * Converts a SpawnOnDeathComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSpawnOnDeathComponent = (
  component: Partial<SpawnOnDeathComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:spawn_on_death': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.additionalSpawnRange !== undefined) {
    const validatedRange: Record<string, number> = {};
    if (component.additionalSpawnRange.min !== undefined) {
      if (
        !validateNumber(
          component.additionalSpawnRange.min,
          'additionalSpawnRange.min',
          undefined,
          undefined,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedRange.min = component.additionalSpawnRange.min;
    }
    if (component.additionalSpawnRange.max !== undefined) {
      if (
        !validateNumber(
          component.additionalSpawnRange.max,
          'additionalSpawnRange.max',
          undefined,
          undefined,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedRange.max = component.additionalSpawnRange.max;
    }
    result.additional_spawn_range = validatedRange;
  }

  if (component.entityToSpawn !== undefined) {
    if (!validateString(component.entityToSpawn, 'entityToSpawn', ctx)) {
      return undefined;
    }
    result.entity_to_spawn = component.entityToSpawn;
  }

  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  if (component.inheritParentName !== undefined) {
    if (!validateBoolean(component.inheritParentName, 'inheritParentName', ctx)) {
      return undefined;
    }
    result.inherit_parent_name = component.inheritParentName;
  }

  if (component.spawnAmount !== undefined) {
    if (!validateInteger(component.spawnAmount, 'spawnAmount', 1, undefined, ctx)) {
      return undefined;
    }
    result.spawn_amount = component.spawnAmount;
  }

  if (component.spawnMethod !== undefined) {
    if (!validateAllowedValues(component.spawnMethod, SPAWN_METHODS, 'spawnMethod', ctx)) {
      return undefined;
    }
    result.spawn_method = component.spawnMethod;
  }

  return {
    'minecraft:spawn_on_death': result,
  };
};
