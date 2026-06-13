import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { VariantComponent } from '../../../interfaces/components/transformation-and-variants/variant-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a VariantComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertVariantComponent = (
  component: Partial<VariantComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:variant': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.value !== undefined) {
    if (!validateNumberRange(component.value, 0, Number.MAX_SAFE_INTEGER, 'value')) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:variant': result
  };
};
