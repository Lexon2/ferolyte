import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { PlayerSaturationComponent } from '../../../interfaces/components/miscellaneous/player-saturation-component';
import { validateInteger } from '../../common/validation';

/**
 * Converts a PlayerSaturationComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPlayerSaturationComponent = (
  component: Partial<PlayerSaturationComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:player.saturation': any } | undefined => {
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
    'minecraft:player.saturation': result
  };
};
