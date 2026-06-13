import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SkinIdComponent } from '../../../interfaces/components/transformation-and-variants/skin-id-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a SkinIdComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSkinIdComponent = (
  component: Partial<SkinIdComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:skin_id': { value: number } } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:skin_id': {
        value: 0 // Default value
      }
    };
  }

  if (!validateNumberRange(component.value, 0, Number.MAX_SAFE_INTEGER, 'value')) {
    return undefined;
  }

  return {
    'minecraft:skin_id': {
      value: component.value
    }
  };
};
