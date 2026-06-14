import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { GroundOffsetComponent } from '../../../interfaces/components/miscellaneous/ground-offset-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a GroundOffsetComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGroundOffsetComponent = (
  component: Partial<GroundOffsetComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:ground_offset': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:ground_offset': result,
  };
};
