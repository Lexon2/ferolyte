import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FrictionModifierComponent } from '../../../interfaces/components/physical/friction-modifier-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a FrictionModifierComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFrictionModifierComponent = (
  component: Partial<FrictionModifierComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:friction_modifier': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:friction_modifier': {
        value: 1.0, // Default value
      },
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_VALUE, 'value')) {
    return undefined;
  }

  return {
    'minecraft:friction_modifier': {
      value: component.value,
    },
  };
};
