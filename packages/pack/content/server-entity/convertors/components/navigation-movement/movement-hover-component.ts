import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MovementHoverComponent } from '../../../interfaces/components/navigation-movement/movement-hover-component';
import { validateMaxTurn } from '../../common/validation';

/**
 * Converts a MovementHoverComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementHoverComponent = (
  component: Partial<MovementHoverComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.hover': any } | undefined => {
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
    'minecraft:movement.hover': result
  };
};
