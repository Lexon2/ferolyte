import { BlockStates } from '../interfaces/block-config';

/**
 * Creates properly formatted block states for Minecraft blocks
 * @param states The block states definition
 * @returns The properly formatted block states or undefined if validation fails
 */
export const convertBlockStates = (
  states?: BlockStates,
): BlockStates | undefined => {
  if (!states || typeof states !== 'object') {
    return undefined;
  }

  const result: BlockStates = {};

  for (const stateName in states) {
    const stateValue = states[stateName];

    // Handle string array states (enumeration states)
    if (Array.isArray(stateValue)) {
      if (stateValue.length === 0) {
        // @TODO: Add error handling
        console.error(
          `State "${stateName}" must have at least one possible value`,
        );

        return undefined;
      }

      // Validate all values are strings
      for (const value of stateValue) {
        if (typeof value === 'string' && value.length === 0) {
          // @TODO: Add error handling
          console.error(
            `State values for "${stateName}" must be non-empty strings`,
          );

          return undefined;
        }
      }

      result[stateName] = [...(stateValue as string[])]; // Copy the array
    }
    // Handle numerical range states
    else if (
      typeof stateValue === 'object' &&
      stateValue !== null &&
      stateValue.values
    ) {
      const { min, max } = stateValue.values;

      if (typeof min !== 'number' || typeof max !== 'number') {
        // @TODO: Add error handling
        console.error(
          `State "${stateName}" min and max values must be numbers`,
        );

        return undefined;
      }

      if (min > max) {
        // @TODO: Add error handling
        console.error(
          `State "${stateName}" min value cannot be greater than max value`,
        );

        return undefined;
      }

      result[stateName] = {
        values: { min, max },
      };
    } else {
      // @TODO: Add error handling
      console.error(
        `State "${stateName}" must be an array of strings or an object with min/max values`,
      );

      return undefined;
    }
  }

  return result;
};

/**
 * Creates a string enumeration state for Minecraft blocks
 * @param values The possible string values for this state
 * @returns Array of string values or undefined if validation fails
 */
export const createEnumState = (values: string[]): string[] | undefined => {
  if (!Array.isArray(values) || values.length === 0) {
    // @TODO: Add error handling
    console.error('Enum state must have at least one possible value');

    return undefined;
  }

  // Validate all values are strings
  for (const value of values) {
    if (typeof value !== 'string' || value.length === 0) {
      // @TODO: Add error handling
      console.error('Enum state values must be non-empty strings');

      return undefined;
    }
  }

  return [...values]; // Return a copy to avoid mutations
};

/**
 * Creates a numerical range state for Minecraft blocks
 * @param min The minimum value
 * @param max The maximum value
 * @returns An object with min/max values or undefined if validation fails
 */
export const createIntState = (
  min: number,
  max: number,
): { values: { min: number; max: number } } | undefined => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    // @TODO: Add error handling
    console.error('Min and max values must be numbers');

    return undefined;
  }

  if (min > max) {
    // @TODO: Add error handling
    console.error('Min value cannot be greater than max value');

    return undefined;
  }

  return {
    values: { min, max },
  };
};

/**
 * Helper function to create a boolean state (true/false)
 * @returns An array with "true" and "false" strings
 */
export const createBooleanState = (): string[] => {
  return ['true', 'false'];
};

/**
 * Helper function to create a direction state (north, south, east, west)
 * @returns An array with cardinal direction strings
 */
export const createDirectionState = (): string[] => {
  return ['north', 'south', 'east', 'west'];
};

/**
 * Helper function to create a facing state (including up and down)
 * @returns An array with all six direction strings
 */
export const createFacingState = (): string[] => {
  return ['north', 'south', 'east', 'west', 'up', 'down'];
};
