import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RailMovementComponent } from '../../../interfaces/components/navigation-movement/rail-movement-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a RailMovementComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRailMovementComponent = (
  component: Partial<RailMovementComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:rail_movement': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate maxSpeed
  if (component.maxSpeed !== undefined) {
    if (!validateNumber(component.maxSpeed, 'maxSpeed')) {
      return undefined;
    }
    result.max_speed = component.maxSpeed;
  }

  return {
    'minecraft:rail_movement': result
  };
};
