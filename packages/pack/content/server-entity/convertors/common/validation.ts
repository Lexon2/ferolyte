/**
 * Entity convertor validation helpers — thin wrappers over shared content-validation.
 */

import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '../../../../common/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateNumber as validateNumberValue,
  validateNumberRange as validateSharedNumberRange,
  validateString as validateStringValue,
  validateVector3 as validateSharedVector3,
} from '../../../../common/validation/content-validation';
import {
  CONTAINER_TYPES,
  ContainerType,
} from '../../constants/container-types';
import {
  DAMAGE_SOURCE_TYPES,
  DamageSourceType,
} from '../../constants/damage-source-types';
import { EFFECT_TYPES, EffectType } from '../../constants/effect-types';

const fieldCtx = (
  ctx: ContentDiagnosticContext | undefined,
  fieldName: string,
): ContentDiagnosticContext | undefined => withFieldPath(ctx, fieldName);

export const validateNumber = (
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (
    !validateNumberValue(
      value,
      ctx,
      `${fieldName} must be a number`,
      fieldName,
    )
  ) {
    return false;
  }

  if (min !== undefined && (value as number) < min) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be greater than or equal to ${min}`,
    );
    return false;
  }

  if (max !== undefined && (value as number) > max) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be less than or equal to ${max}`,
    );
    return false;
  }

  return true;
};

export const validateInteger = (
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be an integer`);
    return false;
  }

  if (min !== undefined && value < min) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be greater than or equal to ${min}`,
    );
    return false;
  }

  if (max !== undefined && value > max) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be less than or equal to ${max}`,
    );
    return false;
  }

  return true;
};

export const validateBoolean = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean =>
  validateBooleanValue(
    value,
    ctx,
    `${fieldName} must be a boolean`,
    fieldName,
  );

export const validateString = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean =>
  validateStringValue(value, ctx, `${fieldName} must be a string`, fieldName);

export const validateComplexRange = (
  value: number | [number, number] | { rangeMin: number; rangeMax: number },
  fieldName: string,
  min?: number,
  max?: number,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value === 'number') {
    return validateNumber(value, fieldName, min, max, ctx);
  }

  if (Array.isArray(value)) {
    if (value.length !== 2) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} array must contain exactly 2 numbers`,
      );
      return false;
    }

    if (
      !value.every((n) =>
        validateNumber(n, `${fieldName} element`, min, max, ctx),
      )
    ) {
      return false;
    }

    if (value[0] > value[1]) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} minimum value must be less than or equal to maximum value`,
      );
      return false;
    }

    return true;
  }

  if (typeof value === 'object' && value !== null) {
    if (
      !validateNumber(value.rangeMin, `${fieldName}.rangeMin`, min, max, ctx) ||
      !validateNumber(value.rangeMax, `${fieldName}.rangeMax`, min, max, ctx)
    ) {
      return false;
    }

    if (value.rangeMin > value.rangeMax) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName}.rangeMin must be less than or equal to ${fieldName}.rangeMax`,
      );
      return false;
    }

    return true;
  }

  logContentError(
    fieldCtx(ctx, fieldName),
    `${fieldName} must be a number, an array of two numbers, or an object with rangeMin and rangeMax properties`,
  );

  return false;
};

export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean =>
  validateSharedNumberRange(
    value,
    min,
    max,
    ctx,
    `${fieldName} must be between ${min} and ${max}`,
    fieldName,
  );

export const validateVector2 = (
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    !value.every((n) => validateNumber(n, `${fieldName} element`, min, max, ctx))
  ) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be an array of exactly 2 numbers`,
    );
    return false;
  }

  return true;
};

export const validateVector3 = (
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (min !== undefined || max !== undefined) {
    if (
      !Array.isArray(value) ||
      value.length !== 3 ||
      !value.every((n) =>
        validateNumber(n, `${fieldName} element`, min, max, ctx),
      )
    ) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} must be an array of exactly 3 numbers`,
      );
      return false;
    }

    return true;
  }

  return validateSharedVector3(
    value,
    ctx,
    `${fieldName} must be an array of exactly 3 numbers`,
    fieldName,
  );
};

export const validateAllowedValues = (
  value: unknown,
  allowedValues: readonly string[],
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean =>
  validateAllowedValue(
    value,
    allowedValues,
    ctx,
    `${fieldName} must be one of: ${allowedValues.join(', ')}`,
    fieldName,
  );

export const validateContainerType = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value !== 'string') {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be a string`);
    return false;
  }

  if (!CONTAINER_TYPES.includes(value as ContainerType)) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be one of: ${CONTAINER_TYPES.join(', ')}`,
    );
    return false;
  }

  return true;
};

export const validateStringArray = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!Array.isArray(value)) {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be an array`);
    return false;
  }

  for (const item of value) {
    if (typeof item !== 'string') {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} must contain only strings`,
      );
      return false;
    }
  }

  return true;
};

export const validateNumberArray = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!Array.isArray(value)) {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be an array`);
    return false;
  }

  return value.every((n) => validateNumber(n, `${fieldName} element`, undefined, undefined, ctx));
};

export const validateMaxTurn = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => validateNumberRange(value as number, 0, 360, fieldName, ctx);

export const validateTime = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value === 'number') {
    if (value < 0) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} must be a positive number`,
      );
      return false;
    }
    return true;
  }

  if (typeof value === 'string') {
    return true;
  }

  logContentError(
    fieldCtx(ctx, fieldName),
    `${fieldName} must be a positive number or a Molang expression`,
  );

  return false;
};

export const validateWeight = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value === 'number') {
    if (value < 0) {
      logContentError(
        fieldCtx(ctx, fieldName),
        `${fieldName} must be a positive number`,
      );
      return false;
    }
    return true;
  }

  logContentError(
    fieldCtx(ctx, fieldName),
    `${fieldName} must be a positive number`,
  );

  return false;
};

export const validateTradeOrLootTablePath = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!validateString(value, fieldName, ctx)) {
    return false;
  }

  if (!(value as string).endsWith('.json')) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must end with .json`,
    );
    return false;
  }

  return true;
};

export const validateDegrees = (
  value: unknown,
  fieldName: string,
  hasNegative: boolean = false,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (
    typeof value !== 'number' ||
    value < (hasNegative ? -360 : 0) ||
    value > 360
  ) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be a number between ${
        hasNegative ? '-360' : '0'
      } and 360`,
    );
    return false;
  }

  return true;
};

export const validatePercentage = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be a number between 0 and 1`,
    );
    return false;
  }

  return true;
};

export const validateSoundEvent = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => validateString(value, fieldName, ctx);

export const validateDamageSourceType = (
  value: DamageSourceType,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (typeof value !== 'string') {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be a string`);
    return false;
  }

  if (!DAMAGE_SOURCE_TYPES.includes(value)) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be one of: ${DAMAGE_SOURCE_TYPES.join(', ')}`,
    );
    return false;
  }

  return true;
};

export const validateDamageSourceTypes = (
  value: DamageSourceType[],
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!Array.isArray(value)) {
    logContentError(fieldCtx(ctx, fieldName), `${fieldName} must be an array`);
    return false;
  }

  return value.every((n) =>
    validateDamageSourceType(n, `${fieldName} element`, ctx),
  );
};

export const validateEffectType = (
  value: EffectType,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!EFFECT_TYPES.includes(value)) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be one of: ${EFFECT_TYPES.join(', ')}`,
    );
    return false;
  }

  return true;
};

export const validateHexColor = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean => {
  if (!validateString(value, fieldName, ctx)) {
    return false;
  }

  const color = value as string;

  if (!color.startsWith('#')) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must start with #`,
    );
    return false;
  }

  if (color.length !== 7 && color.length !== 9) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be 7 or 9 characters long`,
    );
    return false;
  }

  if (!/^[0-9A-Fa-f]+$/.test(color.slice(1))) {
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must contain only hexadecimal characters`,
    );
    return false;
  }

  return true;
};
