import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { Color2Component } from '../../../interfaces/components/transformation-and-variants/color2-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a Color2Component to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertColor2Component = (
  component: Partial<Color2Component>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:color2': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: { value: number } = { value: 0 };

  if (component.value !== undefined) {
    if (
      !validateNumberRange(component.value, 0, Number.MAX_SAFE_INTEGER, 'value')
    ) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:color2': result,
  };
};
