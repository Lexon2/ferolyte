import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TrailComponent } from '../../../interfaces/components/miscellaneous/trail-component';
import { convertEntityFilters } from '../../common/filters.convertor';

/**
 * Converts a TrailComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTrailComponent = (
  component: Partial<TrailComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:trail': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate blockType
  if (component.blockType !== undefined) {
    if (typeof component.blockType !== 'string') {
      console.error('blockType must be a string');

      return undefined;
    }
    result.block_type = component.blockType;
  }

  // Validate spawnFilter
  if (component.spawnFilter !== undefined) {
    const convertedFilters = convertEntityFilters(component.spawnFilter, withFieldPath(ctx, 'spawnFilter'));
    if (!convertedFilters) {
      return undefined;
    }
    result.spawn_filter = convertedFilters;
  }

  // Validate spawnOffset
  if (component.spawnOffset !== undefined) {
    if (!Array.isArray(component.spawnOffset) || component.spawnOffset.length !== 3) {
      console.error('spawnOffset must be an array of 3 numbers');

      return undefined;
    }

    if (!component.spawnOffset.every(coord => typeof coord === 'number')) {
      console.error('spawnOffset must be an array of numbers');

      return undefined;
    }

    result.spawn_offset = component.spawnOffset;
  }

  return {
    'minecraft:trail': result
  };
};
