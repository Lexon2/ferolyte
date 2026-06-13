import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FallDamageComponent } from '../../../interfaces/components/miscellaneous/fall-damage-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a FallDamageComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFallDamageComponent = (
  component: Partial<FallDamageComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:fall_damage': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:fall_damage': result,
  };
};
