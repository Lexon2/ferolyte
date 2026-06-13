import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EFFECT_TYPES } from '../../../constants/effect-types';
import { AttackComponent } from '../../../interfaces/components/combat/attack-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a damage value
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateDamage = (
  value: number | [number, number],
  fieldName: string,
): boolean => {
  if (typeof value === 'number') {
    return true; // Allow negative values for healing
  }

  if (Array.isArray(value)) {
    if (value.length !== 2) {
      console.error(`${fieldName} array must have exactly 2 elements`);

      return false;
    }
    if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
      console.error(`${fieldName} array elements must be numbers`);

      return false;
    }
    if (value[0] > value[1]) {
      console.error(`${fieldName} minimum value must be less than or equal to maximum value`);

      return false;
    }
    return true;
  }

  console.error(`${fieldName} must be a number or array of two numbers`);

  return false;
};

/**
 * Validates an effect name against the list of valid effect types
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateEffectName = (
  value: string,
  fieldName: string,
): boolean => {
  if (!validateString(value, fieldName)) {
    return false;
  }
  if (!EFFECT_TYPES.includes(value as any)) {
    console.error(`${fieldName} must be one of: ${EFFECT_TYPES.join(', ')}`);

    return false;
  }
  return true;
};

/**
 * Converts an AttackComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAttackComponent = (
  component: Partial<AttackComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:attack': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate damage (required)
  if (component.damage === undefined) {
    console.error('damage is required for attack component');

    return undefined;
  }
  if (!validateDamage(component.damage, 'damage')) {
    return undefined;
  }
  result.damage = component.damage;

  // Validate effectName
  if (component.effectName !== undefined) {
    if (!validateEffectName(component.effectName, 'effectName')) {
      return undefined;
    }
    result.effect_name = component.effectName;
  }

  // Validate effectDuration
  if (component.effectDuration !== undefined) {
    if (component.effectDuration === 'infinite') {
      result.effect_duration = 'infinite';
    } else {
      if (!validateNumber(component.effectDuration, 'effectDuration', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      result.effect_duration = component.effectDuration;
    }
  }

  return {
    'minecraft:attack': result,
  };
};
