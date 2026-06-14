import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { HorseJumpStrengthComponent } from '../../../interfaces/components/control/horse-jump-strength-component';
import { validateNumber } from '../../common/validation';

/**
 * Validates a range value
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateRange = (
  value: { rangeMin?: number; rangeMax?: number } | undefined,
  fieldName: string,
): boolean => {
  if (value === undefined) {
    return true;
  }

  if (value.rangeMin !== undefined && !validateNumber(value.rangeMin, `${fieldName}.rangeMin`, 0, Number.MAX_VALUE)) {
    return false;
  }

  if (value.rangeMax !== undefined && !validateNumber(value.rangeMax, `${fieldName}.rangeMax`, 0, Number.MAX_VALUE)) {
    return false;
  }

  return true;
};

/**
 * Converts a HorseJumpStrengthComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHorseJumpStrengthComponent = (
  component: Partial<HorseJumpStrengthComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:horse.jump_strength': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (typeof component.value === 'number') {
      if (!validateNumber(component.value, 'value', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      result.value = component.value;
    } else {
      if (!validateRange(component.value, 'value')) {
        return undefined;
      }
      result.value = {
        range_min: component.value.rangeMin,
        range_max: component.value.rangeMax,
      };
    }
  }

  return {
    'minecraft:horse.jump_strength': result,
  };
};
