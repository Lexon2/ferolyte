import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { CombatRegenerationComponent } from '../../../interfaces/components/combat/combat-regeneration-component';
import { validateBoolean } from '../../common/validation';

/**
 * Validates if a value is a valid regeneration duration
 * @param value The value to validate
 * @param fieldName The name of the field being validated
 * @returns True if the value is valid, false otherwise
 */
export const validateRegenerationDuration = (
  value: any,
  fieldName: string
): boolean => {
  if (typeof value === 'number') {
    if (value < 0) {
      console.error(`${fieldName} must be a positive number or 'infinite'`);

      return false;
    }
    return true;
  }
  if (value === 'infinite') {
    return true;
  }
  console.error(`${fieldName} must be a positive number or 'infinite'`);

  return false;
};

/**
 * Converts a CombatRegenerationComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCombatRegenerationComponent = (
  component: Partial<CombatRegenerationComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:combat_regeneration': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate applyToFamily
  if (component.applyToFamily !== undefined) {
    if (!validateBoolean(component.applyToFamily, 'applyToFamily')) {
      return undefined;
    }
    result.apply_to_family = component.applyToFamily;
  }

  // Validate applyToSelf
  if (component.applyToSelf !== undefined) {
    if (!validateBoolean(component.applyToSelf, 'applyToSelf')) {
      return undefined;
    }
    result.apply_to_self = component.applyToSelf;
  }

  // Validate regenerationDuration
  if (component.regenerationDuration !== undefined) {
    if (!validateRegenerationDuration(component.regenerationDuration, 'regenerationDuration')) {
      return undefined;
    }
    result.regeneration_duration = component.regenerationDuration;
  }

  return {
    'minecraft:combat_regeneration': result
  };
};
