import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PhysicsComponent } from '../../../interfaces/components/physical/physics-component';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a PhysicsComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPhysicsComponent = (
  component: Partial<PhysicsComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:physics': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.hasCollision !== undefined) {
    if (!validateBoolean(component.hasCollision, 'hasCollision')) {
      return undefined;
    }
    result.has_collision = component.hasCollision;
  }

  if (component.hasGravity !== undefined) {
    if (!validateBoolean(component.hasGravity, 'hasGravity')) {
      return undefined;
    }
    result.has_gravity = component.hasGravity;
  }

  if (component.pushTowardsClosestSpace !== undefined) {
    if (
      !validateBoolean(
        component.pushTowardsClosestSpace,
        'pushTowardsClosestSpace',
      )
    ) {
      return undefined;
    }
    result.push_towards_closest_space = component.pushTowardsClosestSpace;
  }

  return {
    'minecraft:physics': result,
  };
};
