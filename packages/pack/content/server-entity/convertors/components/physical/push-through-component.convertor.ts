import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PushThroughComponent } from '../../../interfaces/components/physical/push-through-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a PushThroughComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPushThroughComponent = (
  component: Partial<PushThroughComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:push_through': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:push_through': {
        value: 0.0 // Default value
      }
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_VALUE, 'value')) {
    return undefined;
  }

  return {
    'minecraft:push_through': {
      value: component.value
    }
  };
};
