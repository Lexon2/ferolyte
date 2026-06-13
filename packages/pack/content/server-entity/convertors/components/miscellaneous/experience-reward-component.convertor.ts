import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ExperienceRewardComponent } from '../../../interfaces/components/miscellaneous/experience-reward-component';
// TODO: Validate molang expression
/**
 * Validates a molang expression or array of expressions
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateMolangExpression = (
  value: string | number | (string | number)[] | undefined,
  fieldName: string,
): boolean => {
  if (value === undefined) {
    return true;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string' || typeof item === 'number');
  }

  console.error(`${fieldName} must be a string, number, or array of strings/numbers`);

  return false;
};

/**
 * Converts an ExperienceRewardComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertExperienceRewardComponent = (
  component: Partial<ExperienceRewardComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:experience_reward': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate onBred
  if (component.onBred !== undefined) {
    if (!validateMolangExpression(component.onBred, 'onBred')) {
      return undefined;
    }
    result.on_bred = component.onBred;
  }

  // Validate onDeath
  if (component.onDeath !== undefined) {
    if (!validateMolangExpression(component.onDeath, 'onDeath')) {
      return undefined;
    }
    result.on_death = component.onDeath;
  }

  return {
    'minecraft:experience_reward': result,
  };
};
