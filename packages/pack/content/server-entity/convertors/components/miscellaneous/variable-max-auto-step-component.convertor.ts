import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { VariableMaxAutoStepComponent } from '../../../interfaces/components/miscellaneous/variable-max-auto-step-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a VariableMaxAutoStepComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertVariableMaxAutoStepComponent = (
  component: Partial<VariableMaxAutoStepComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:variable_max_auto_step': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate baseValue
  if (component.baseValue !== undefined) {
    if (!validateNumber(component.baseValue, 'baseValue')) {
      return undefined;
    }
    result.base_value = component.baseValue;
  }

  // Validate controlledValue
  if (component.controlledValue !== undefined) {
    if (!validateNumber(component.controlledValue, 'controlledValue')) {
      return undefined;
    }
    result.controlled_value = component.controlledValue;
  }

  // Validate jumpPreventedValue
  if (component.jumpPreventedValue !== undefined) {
    if (!validateNumber(component.jumpPreventedValue, 'jumpPreventedValue')) {
      return undefined;
    }
    result.jump_prevented_value = component.jumpPreventedValue;
  }

  return {
    'minecraft:variable_max_auto_step': result,
  };
};
