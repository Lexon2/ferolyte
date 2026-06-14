import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AirDragModifierComponent } from '../../../interfaces/components/physical/air-drag-modifier-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts an AirDragModifierComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAirDragModifierComponent = (
  component: Partial<AirDragModifierComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:air_drag_modifier': { value?: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: { value?: number } = {};

  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value', undefined, undefined, ctx)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:air_drag_modifier': result,
  };
};
