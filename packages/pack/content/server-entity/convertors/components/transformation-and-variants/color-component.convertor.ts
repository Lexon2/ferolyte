import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ColorComponent } from '../../../interfaces/components/transformation-and-variants/color-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a ColorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertColorComponent = (
  component: Partial<ColorComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:color': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: { value: number } = { value: 0 };

  if (component.value !== undefined) {
    if (!validateNumberRange(component.value, 0, Number.MAX_SAFE_INTEGER, 'value')) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:color': result,
  };
};
