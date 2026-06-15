import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PlayerExperienceComponent } from '../../../interfaces/components/miscellaneous/player-experience-component';
import { validateInteger } from '../../common/validation';

/**
 * Converts a PlayerExperienceComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPlayerExperienceComponent = (
  component: Partial<PlayerExperienceComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:player.experience': any } | undefined => {
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
    'minecraft:player.experience': result,
  };
};
