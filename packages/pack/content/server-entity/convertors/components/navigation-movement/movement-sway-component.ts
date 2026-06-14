import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MovementSwayComponent } from '../../../interfaces/components/navigation-movement/movement-sway-component';
import { validateMaxTurn } from '../../common/validation';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a MovementSwayComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementSwayComponent = (
  component: Partial<MovementSwayComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement.sway': any } | undefined => {
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

  // Validate swayAmplitude
  if (component.swayAmplitude !== undefined) {
    if (!validateNumberRange(component.swayAmplitude, 0, Number.MAX_VALUE, 'swayAmplitude')) {
      return undefined;
    }
    result.sway_amplitude = component.swayAmplitude;
  }

  // Validate swayFrequency
  if (component.swayFrequency !== undefined) {
    if (!validateNumberRange(component.swayFrequency, 0, Number.MAX_VALUE, 'swayFrequency')) {
      return undefined;
    }
    result.sway_frequency = component.swayFrequency;
  }

  return {
    'minecraft:movement.sway': result
  };
};
