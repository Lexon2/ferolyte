import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ConditionalBandwidthOptimizationComponent, ConditionalBandwidthOptimizationConditionalValue } from '../../../interfaces/components/miscellaneous/conditional-bandwidth-optimization-component';
import { validateNumber } from '../../common/validation';

/**
 * Validates a conditional value object
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateConditionalValue = (
  value: ConditionalBandwidthOptimizationConditionalValue,
  fieldName: string,
): boolean => {
  if (value.maxDroppedTicks !== undefined) {
    if (!validateNumber(value.maxDroppedTicks, `${fieldName}.maxDroppedTicks`, 0, Number.MAX_VALUE)) {
      return false;
    }
  }

  if (value.maxOptimizedDistance !== undefined) {
    if (!validateNumber(value.maxOptimizedDistance, `${fieldName}.maxOptimizedDistance`, 0, Number.MAX_VALUE)) {
      return false;
    }
  }

  if (value.useMotionPredictionHints !== undefined) {
    if (typeof value.useMotionPredictionHints !== 'boolean') {
      console.error(`${fieldName}.useMotionPredictionHints must be a boolean`);

      return false;
    }
  }

  // Filters are validated elsewhere
  return true;
};

/**
 * Converts a ConditionalBandwidthOptimizationComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertConditionalBandwidthOptimizationComponent = (
  component: Partial<ConditionalBandwidthOptimizationComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:conditional_bandwidth_optimization': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate conditionalValues
  if (component.conditionalValues !== undefined) {
    if (!Array.isArray(component.conditionalValues)) {
      console.error('conditionalValues must be an array');

      return undefined;
    }

    const validatedValues = component.conditionalValues.map((value, index) => {
      if (!validateConditionalValue(value, `conditionalValues[${index}]`)) {
        return undefined;
      }

      const validatedValue: any = {};
      if (value.maxDroppedTicks !== undefined) {
        validatedValue.max_dropped_ticks = value.maxDroppedTicks;
      }
      if (value.maxOptimizedDistance !== undefined) {
        validatedValue.max_optimized_distance = value.maxOptimizedDistance;
      }
      if (value.useMotionPredictionHints !== undefined) {
        validatedValue.use_motion_prediction_hints = value.useMotionPredictionHints;
      }
      if (value.conditionalValues !== undefined) {
        validatedValue.conditional_values = value.conditionalValues;
      }
      return validatedValue;
    });

    if (validatedValues.includes(undefined)) {
      return undefined;
    }

    result.conditional_values = validatedValues;
  }

  // Validate defaultValues
  if (component.defaultValues !== undefined) {
    const validatedDefaults: any = {};
    if (component.defaultValues.maxDroppedTicks !== undefined) {
      if (!validateNumber(component.defaultValues.maxDroppedTicks, 'defaultValues.maxDroppedTicks', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedDefaults.max_dropped_ticks = component.defaultValues.maxDroppedTicks;
    }
    if (component.defaultValues.maxOptimizedDistance !== undefined) {
      if (!validateNumber(component.defaultValues.maxOptimizedDistance, 'defaultValues.maxOptimizedDistance', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedDefaults.max_optimized_distance = component.defaultValues.maxOptimizedDistance;
    }
    if (component.defaultValues.useMotionPredictionHints !== undefined) {
      if (typeof component.defaultValues.useMotionPredictionHints !== 'boolean') {
        console.error('defaultValues.useMotionPredictionHints must be a boolean');

        return undefined;
      }
      validatedDefaults.use_motion_prediction_hints = component.defaultValues.useMotionPredictionHints;
    }
    result.default_values = validatedDefaults;
  }

  return {
    'minecraft:conditional_bandwidth_optimization': result,
  };
};
