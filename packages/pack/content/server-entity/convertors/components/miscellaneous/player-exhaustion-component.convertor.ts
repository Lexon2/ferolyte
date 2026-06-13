import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { PlayerExhaustionComponent } from '../../../interfaces/components/miscellaneous/player-exhaustion-component';
import { validateInteger } from '../../common/validation';

/**
 * Converts a PlayerExhaustionComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPlayerExhaustionComponent = (
  component: Partial<PlayerExhaustionComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:player.exhaustion': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (!validateInteger(component.value, 'value')) {
      return undefined;
    }
    result.value = component.value;
  }

  // Validate max
  if (component.max !== undefined) {
    if (!validateInteger(component.max, 'max')) {
      return undefined;
    }
    result.max = component.max;
  }

  return {
    'minecraft:player.exhaustion': result
  };
};
