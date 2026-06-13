import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementGlideComponent } from '../../../interfaces/components/navigation-movement/movement-glide-component';
import { validateMaxTurn } from '../../common/validation';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a MovementGlideComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementGlideComponent = (
  component: Partial<MovementGlideComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.glide': any } | undefined => {
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

  // Validate startSpeed
  if (component.startSpeed !== undefined) {
    if (!validateNumberRange(component.startSpeed, 0, Number.MAX_VALUE, 'startSpeed')) {
      return undefined;
    }
    result.start_speed = component.startSpeed;
  }

  // Validate speedWhenTurning
  if (component.speedWhenTurning !== undefined) {
    if (!validateNumberRange(component.speedWhenTurning, 0, Number.MAX_VALUE, 'speedWhenTurning')) {
      return undefined;
    }
    result.speed_when_turning = component.speedWhenTurning;
  }

  return {
    'minecraft:movement.glide': result
  };
};
