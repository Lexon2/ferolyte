import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { GrowsCropComponent } from '../../../interfaces/components/miscellaneous/grows-crop-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a GrowsCropComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGrowsCropComponent = (
  component: Partial<GrowsCropComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:grows_crop': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate chance
  if (component.chance !== undefined) {
    if (!validateNumber(component.chance, 'chance', 0, 1)) {
      return undefined;
    }
    result.chance = component.chance;
  }

  // Validate charges
  if (component.charges !== undefined) {
    if (!validateNumber(component.charges, 'charges', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.charges = component.charges;
  }

  return {
    'minecraft:grows_crop': result,
  };
};
