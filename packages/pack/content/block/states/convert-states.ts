import { BlockStates } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { logContentError } from '../../../common/diagnostics/content-diagnostic';
import {
  validateNonEmptyArray,
  validateNonEmptyString,
  validateNumber,
} from '../../../common/validation/content-validation';

/**
 * Creates properly formatted block states for Minecraft blocks
 */
export const convertBlockStates = (
  states?: BlockStates,
  ctx?: ContentDiagnosticContext,
): BlockStates | undefined => {
  if (!states || typeof states !== 'object') {
    return undefined;
  }

  const result: BlockStates = {};

  for (const stateName in states) {
    const stateValue = states[stateName];
    const stateContext =
      ctx !== undefined ? { ...ctx, fieldPath: stateName } : undefined;

    if (Array.isArray(stateValue)) {
      if (
        !validateNonEmptyArray(
          stateValue,
          stateContext,
          `State "${stateName}" must have at least one possible value`,
        )
      ) {
        return undefined;
      }

      for (let index = 0; index < stateValue.length; index++) {
        const value = stateValue[index];
        if (typeof value !== 'string' || value.length === 0) {
          logContentError(
            stateContext !== undefined
              ? { ...stateContext, fieldPath: `[${index}]` }
              : undefined,
            `State values for "${stateName}" must be non-empty strings`,
          );
          return undefined;
        }
      }

      result[stateName] = [...(stateValue as string[])];
    } else if (
      typeof stateValue === 'object' &&
      stateValue !== null &&
      stateValue.values
    ) {
      const { min, max } = stateValue.values;

      if (
        !validateNumber(
          min,
          stateContext,
          `State "${stateName}" min and max values must be numbers`,
          'values.min',
        ) ||
        !validateNumber(
          max,
          stateContext,
          `State "${stateName}" min and max values must be numbers`,
          'values.max',
        )
      ) {
        return undefined;
      }

      if (min > max) {
        logContentError(
          stateContext !== undefined
            ? { ...stateContext, fieldPath: 'values' }
            : undefined,
          `State "${stateName}" min value cannot be greater than max value`,
        );
        return undefined;
      }

      result[stateName] = {
        values: { min, max },
      };
    } else {
      logContentError(
        stateContext,
        `State "${stateName}" must be an array of strings or an object with min/max values`,
      );
      return undefined;
    }
  }

  return result;
};

/**
 * Creates a string enumeration state for Minecraft blocks
 */
export const createEnumState = (
  values: string[],
  ctx?: ContentDiagnosticContext,
): string[] | undefined => {
  if (!validateNonEmptyArray(values, ctx, 'Enum state must have at least one possible value')) {
    return undefined;
  }

  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (
      !validateNonEmptyString(
        value,
        ctx,
        'Enum state values must be non-empty strings',
        `[${index}]`,
      )
    ) {
      return undefined;
    }
  }

  return [...values];
};

/**
 * Creates a numerical range state for Minecraft blocks
 */
export const createIntState = (
  min: number,
  max: number,
  ctx?: ContentDiagnosticContext,
): { values: { min: number; max: number } } | undefined => {
  if (
    !validateNumber(min, ctx, 'Min and max values must be numbers', 'min') ||
    !validateNumber(max, ctx, 'Min and max values must be numbers', 'max')
  ) {
    return undefined;
  }

  if (min > max) {
    logContentError(ctx, 'Min value cannot be greater than max value');
    return undefined;
  }

  return {
    values: { min, max },
  };
};

export const createBooleanState = (): string[] => {
  return ['true', 'false'];
};

export const createDirectionState = (): string[] => {
  return ['north', 'south', 'east', 'west'];
};

export const createFacingState = (): string[] => {
  return ['north', 'south', 'east', 'west', 'up', 'down'];
};
