import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MarkVariantComponent } from '../../../interfaces/components/transformation-and-variants/mark-variant-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a MarkVariantComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertMarkVariantComponent = (
  component: Partial<MarkVariantComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {}

  if (component.value !== undefined) {
    if (!validateNumberRange(component.value, 0, Number.MAX_SAFE_INTEGER, 'value')) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:mark_variant': result
  };
};
