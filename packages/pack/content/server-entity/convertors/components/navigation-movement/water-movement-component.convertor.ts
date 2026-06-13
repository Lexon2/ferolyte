import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { WaterMovementComponent } from '../../../interfaces/components/navigation-movement/water-movement';
import { validateNumber } from '../../common/validation';

/**
 * Converts a WaterMovementComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertWaterMovementComponent = (
  component: Partial<WaterMovementComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:water_movement': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate dragFactor
  if (component.dragFactor !== undefined) {
    if (!validateNumber(component.dragFactor, 'dragFactor')) {
      return undefined;
    }
    result.drag_factor = component.dragFactor;
  }

  return {
    'minecraft:water_movement': result
  };
};
