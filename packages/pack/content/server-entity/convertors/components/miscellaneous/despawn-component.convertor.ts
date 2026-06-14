import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DespawnComponent } from '../../../interfaces/components/miscellaneous/despawn-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a DespawnComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDespawnComponent = (
  component: Partial<DespawnComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:despawn': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate despawnFromChance
  if (component.despawnFromChance !== undefined) {
    if (typeof component.despawnFromChance !== 'boolean') {
      console.error('despawnFromChance must be a boolean');

      return undefined;
    }
    result.despawn_from_chance = component.despawnFromChance;
  }

  // Validate despawnFromDistance
  if (component.despawnFromDistance !== undefined) {
    const validatedDistance: any = {};
    if (component.despawnFromDistance.maxDistance !== undefined) {
      if (!validateNumber(component.despawnFromDistance.maxDistance, 'despawnFromDistance.maxDistance', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedDistance.max_distance = component.despawnFromDistance.maxDistance;
    }
    if (component.despawnFromDistance.minDistance !== undefined) {
      if (!validateNumber(component.despawnFromDistance.minDistance, 'despawnFromDistance.minDistance', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedDistance.min_distance = component.despawnFromDistance.minDistance;
    }
    result.despawn_from_distance = validatedDistance;
  }

  // Validate despawnFromInactivity
  if (component.despawnFromInactivity !== undefined) {
    if (typeof component.despawnFromInactivity !== 'boolean') {
      console.error('despawnFromInactivity must be a boolean');

      return undefined;
    }
    result.despawn_from_inactivity = component.despawnFromInactivity;
  }

  // Validate despawnFromSimulationEdge
  if (component.despawnFromSimulationEdge !== undefined) {
    if (typeof component.despawnFromSimulationEdge !== 'boolean') {
      console.error('despawnFromSimulationEdge must be a boolean');

      return undefined;
    }
    result.despawn_from_simulation_edge = component.despawnFromSimulationEdge;
  }

  // Validate filters
  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate minRangeInactivityTimer
  if (component.minRangeInactivityTimer !== undefined) {
    if (!validateNumber(component.minRangeInactivityTimer, 'minRangeInactivityTimer', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.min_range_inactivity_timer = component.minRangeInactivityTimer;
  }

  // Validate minRangeRandomChance
  if (component.minRangeRandomChance !== undefined) {
    if (!validateNumber(component.minRangeRandomChance, 'minRangeRandomChance', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.min_range_random_chance = component.minRangeRandomChance;
  }

  // Validate removeChildEntities
  if (component.removeChildEntities !== undefined) {
    if (typeof component.removeChildEntities !== 'boolean') {
      console.error('removeChildEntities must be a boolean');

      return undefined;
    }
    result.remove_child_entities = component.removeChildEntities;
  }

  return {
    'minecraft:despawn': result,
  };
};
