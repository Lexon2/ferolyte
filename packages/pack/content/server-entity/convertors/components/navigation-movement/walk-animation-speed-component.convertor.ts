import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { WalkAnimationSpeedComponent } from '../../../interfaces/components/navigation-movement/walk-animation-speed-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a WalkAnimationSpeedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertWalkAnimationSpeedComponent = (
  component: Partial<WalkAnimationSpeedComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:walk_animation_speed': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:walk_animation_speed': {
        value: 1, // Default value
      },
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_VALUE, 'value')) {
    return undefined;
  }

  return {
    'minecraft:walk_animation_speed': {
      value: component.value,
    },
  };
};
