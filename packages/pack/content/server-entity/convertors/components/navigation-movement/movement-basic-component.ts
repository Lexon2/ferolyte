import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementBasicComponent } from '../../../interfaces/components/navigation-movement/movement-basic-component';
import { validateMaxTurn } from '../../common/validation';

/**
 * Converts a MovementBasicComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementBasicComponent = (
  component: Partial<MovementBasicComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.basic': any } | undefined => {
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
    'minecraft:movement.basic': result
  };
};
