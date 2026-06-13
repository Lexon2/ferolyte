import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { BouncinessComponent } from '../../../interfaces/components/physical/bounciness-component';
import { validateInteger } from '../../common/validation';

/**
 * Converts a BouncinessComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBouncinessComponent = (
  component: Partial<BouncinessComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:bounciness': { value?: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: { value?: number } = {};

  if (component.value !== undefined) {
    if (!validateInteger(component.value, 'value', undefined, undefined, ctx)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:bounciness': result,
  };
};
