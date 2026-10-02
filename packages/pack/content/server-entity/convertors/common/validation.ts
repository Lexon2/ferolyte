/**
 * Entity convertor validation helpers — thin wrappers over shared content-validation.
 */

import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateNumber as validateNumberValue,
  validateNumberRange as validateSharedNumberRange,
  validateString as validateStringValue,
  validateVector3 as validateSharedVector3,
} from '@ferolyte/common/content/validation/content-validation';
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
    !validateNumberValue(value, ctx, `${fieldName} must be a number`, fieldName)
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
    logContentError(
      fieldCtx(ctx, fieldName),
      `${fieldName} must be an integer`,
    );
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
  validateBooleanValue(value, ctx, `${fieldName} must be a boolean`, fieldName);

export const validateString = (
  value: unknown,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): boolean =>
  validateStringValue(value, ctx, `${fieldName} must be a string`, fieldName);

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
    !value.every((n) =>
      validateNumber(n, `${fieldName} element`, min, max, ctx),
    )
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
