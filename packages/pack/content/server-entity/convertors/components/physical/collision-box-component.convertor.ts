import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { CollisionBoxComponent } from '../../../interfaces/components/physical/collision-box-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a CollisionBoxComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCollisionBoxComponent = (
  component: Partial<CollisionBoxComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:collision_box': { width: number; height: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: { width: number; height: number } = {
    width: 1.0, // Default value
    height: 1.0 // Default value
  };

  if (component.width !== undefined) {
    if (!validateNumberRange(component.width, 0, Number.MAX_VALUE, 'width')) {
      return undefined;
    }
    result.width = component.width;
  }

  if (component.height !== undefined) {
    if (!validateNumberRange(component.height, 0, Number.MAX_VALUE, 'height')) {
      return undefined;
    }
    result.height = component.height;
  }

  return {
    'minecraft:collision_box': result
  };
};
