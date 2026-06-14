/**
 * Validates an attribute component
 * @param value The value to validate
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @param fieldName The name of the field being validated
 * @returns true if valid, false otherwise
 */
export const validateAttribute = (
  value: number,
  min: number | undefined,
  max: number | undefined,
  fieldName: string,
): boolean => {
  if (typeof value !== 'number' || isNaN(value)) {
    console.error(`${fieldName} must be a number`);

    return false;
  }

  if (min !== undefined && value < min) {
    console.error(`${fieldName} must be greater than or equal to ${min}`);

    return false;
  }

  if (max !== undefined && value > max) {
    console.error(`${fieldName} must be less than or equal to ${max}`);

    return false;
  }

  return true;
};

/**
 * Converts an attribute component to Minecraft format
 * @param component The component to convert
 * @param componentName The name of the component in Minecraft format (e.g., 'health', 'movement')
 * @param min The minimum allowed value for the attribute
 * @param max The maximum allowed value for the attribute
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertAttributeComponent = (
  component: { value?: number; min?: number; max?: number },
  componentName: string,
  min: number | undefined = undefined,
  max: number | undefined = undefined,
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, any> = {
    [`minecraft:${componentName}`]: {},
  };

  if (component.value !== undefined) {
    if (!validateAttribute(component.value, min, max, 'value')) {
      return undefined;
    }
    result[`minecraft:${componentName}`].value = component.value;
  }

  if (component.min !== undefined) {
    if (!validateAttribute(component.min, min, max, 'min')) {
      return undefined;
    }
    result[`minecraft:${componentName}`].min = component.min;
  }

  if (component.max !== undefined) {
    if (!validateAttribute(component.max, min, max, 'max')) {
      return undefined;
    }
    result[`minecraft:${componentName}`].max = component.max;
  }

  return result;
};
