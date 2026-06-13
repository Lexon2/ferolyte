import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { DimensionBoundComponent } from '../../../interfaces/components/miscellaneous/dimension-bound-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a DimensionBoundComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDimensionBoundComponent = (
  component: Partial<DimensionBoundComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:dimension_bound': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:dimension_bound': result,
  };
};
