import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { StrengthComponent } from '../../../interfaces/components/miscellaneous/strength-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a StrengthComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertStrengthComponent = (
  component: StrengthComponent,
  ctx?: ContentDiagnosticContext
): { 'minecraft:strength': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.max !== undefined) {
    if (!validateNumber(component.max, 'max')) {
      return undefined;
    }
    result.max = component.max;
  }

  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value')) {
      return undefined;
    }
    result.value = component.value;
  }

  return result;
};

