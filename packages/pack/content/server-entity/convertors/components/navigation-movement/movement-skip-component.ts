import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementSkipComponent } from '../../../interfaces/components/navigation-movement/movement-skip-component';
import { validateMaxTurn } from '../../common/validation';

/**
 * Converts a MovementSkipComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementSkipComponent = (
  component: Partial<MovementSkipComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.skip': any } | undefined => {
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
    'minecraft:movement.skip': result
  };
};
