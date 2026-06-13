import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementAmphibiousComponent } from '../../../interfaces/components/navigation-movement/movement-amphibious-component';
import { validateMaxTurn } from '../../common/validation';

/**
 * Converts a MovementAmphibiousComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementAmphibiousComponent = (
  component: Partial<MovementAmphibiousComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.amphibious': any } | undefined => {
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
    'minecraft:movement.amphibious': result
  };
};
