import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SoundVolumeComponent } from '../../../interfaces/components/miscellaneous/sound-volume-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a SoundVolumeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSoundVolumeComponent = (
  component: Partial<SoundVolumeComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:sound_volume': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:sound_volume': {
        value: 1.0, // Default value
      },
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_VALUE, 'value')) {
    return undefined;
  }

  return {
    'minecraft:sound_volume': {
      value: component.value,
    },
  };
};
