import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MovementFlyComponent } from '../../../interfaces/components/navigation-movement/movement-fly-component';
import { validateMaxTurn } from '../../common/validation';

/**
 * Converts a MovementFlyComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementFlyComponent = (
  component: Partial<MovementFlyComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.fly': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate maxTurn
  if (component.maxTurn !== undefined) {
    if (!validateMaxTurn(component.maxTurn, 'maxTurn')) {
      return undefined;
    }
    result.max_turn = component.maxTurn;
  }

  return {
    'minecraft:movement.fly': result
  };
};
