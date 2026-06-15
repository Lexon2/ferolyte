import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ScaleComponent } from '../../../interfaces/components/physical/scale-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a ScaleComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertScaleComponent = (
  component: Partial<ScaleComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:scale': any } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:scale': {
        value: 0.0, // Default value
      },
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_VALUE, 'value')) {
    return undefined;
  }

  return {
    'minecraft:scale': {
      value: component.value,
    },
  };
};
