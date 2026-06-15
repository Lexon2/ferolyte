import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PlayerLevelComponent } from '../../../interfaces/components/miscellaneous/player-level-component';
import { validateInteger } from '../../common/validation';

/**
 * Converts a PlayerLevelComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPlayerLevelComponent = (
  component: Partial<PlayerLevelComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:player.level': any } | undefined => {
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
    'minecraft:player.level': result,
  };
};
