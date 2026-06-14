import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MovementSoundDistanceOffsetComponent } from '../../../interfaces/components/miscellaneous/movement-sound-distance-offset-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a MovementSoundDistanceOffsetComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMovementSoundDistanceOffsetComponent = (
  component: Partial<MovementSoundDistanceOffsetComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:movement_sound_distance_offset': any } | undefined => {
  if (!component) {
    return undefined;
  }

  // Validate value
  if (!validateNumber(component.value, 'value')) {
    return undefined;
  }

  return {
    'minecraft:movement_sound_distance_offset': {
      value: component.value
    }
  };
};
