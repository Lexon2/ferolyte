import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementJumpComponent } from '../../../interfaces/components/navigation-movement/movement-jump-component';
import { validateMaxTurn } from '../../common/validation';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a MovementJumpComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementJumpComponent = (
  component: Partial<MovementJumpComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.jump': any } | undefined => {
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

  // Validate jumpDelay
  if (component.jumpDelay !== undefined) {
    if (!Array.isArray(component.jumpDelay) || component.jumpDelay.length !== 2) {
      console.error('jumpDelay must be an array with two numbers');

      return undefined;
    }

    const [min, max] = component.jumpDelay;
    if (!validateNumberRange(min, 0, Number.MAX_VALUE, 'jumpDelay[0]') ||
        !validateNumberRange(max, 0, Number.MAX_VALUE, 'jumpDelay[1]')) {
      return undefined;
    }

    result.jump_delay = component.jumpDelay;
  }

  return {
    'minecraft:movement.jump': result
  };
};
