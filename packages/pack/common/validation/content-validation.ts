import { DamageSourceType } from '../types/damage-source';
import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '../diagnostics/content-diagnostic';

const resolveContext = (
  ctx: ContentDiagnosticContext | undefined,
  fieldPath?: string,
): ContentDiagnosticContext | undefined => {
  if (fieldPath === undefined || fieldPath.length === 0) {
    return ctx;
  }

  return withFieldPath(ctx, fieldPath);
};

export const validateBooleanValue = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a boolean',
  fieldPath?: string,
): value is boolean => {
  if (typeof value !== 'boolean') {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateNonEmptyString = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a non-empty string',
  fieldPath?: string,
): value is string => {
  if (typeof value !== 'string' || value.length === 0) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateString = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a string',
  fieldPath?: string,
): value is string => {
  if (typeof value !== 'string') {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validatePositiveNumber = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a positive number',
  fieldPath?: string,
): value is number => {
  if (typeof value !== 'number' || value <= 0) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateNonNegativeNumber = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a non-negative number',
  fieldPath?: string,
): value is number => {
  if (typeof value !== 'number' || value < 0) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateNumber = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a number',
  fieldPath?: string,
): value is number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateIntegerRange = (
  value: unknown,
  min: number,
  max: number,
  ctx: ContentDiagnosticContext | undefined,
  reason?: string,
  fieldPath?: string,
): value is number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    logContentError(
      resolveContext(ctx, fieldPath),
      reason ?? 'Value must be an integer',
    );
    return false;
  }

  if (value < min || value > max) {
    logContentError(
      resolveContext(ctx, fieldPath),
      reason ?? `Value must be between ${min} and ${max}`,
    );
    return false;
  }

  return true;
};

export const validateNumberRange = (
  value: unknown,
  min: number,
  max: number,
  ctx: ContentDiagnosticContext | undefined,
  reason?: string,
  fieldPath?: string,
): value is number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    logContentError(
      resolveContext(ctx, fieldPath),
      reason ?? 'Value must be a number',
    );
    return false;
  }

  if (value < min || value > max) {
    logContentError(
      resolveContext(ctx, fieldPath),
      reason ?? `Value must be between ${min} and ${max}`,
    );
    return false;
  }

  return true;
};

export const validateAllowedValue = <T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  ctx: ContentDiagnosticContext | undefined,
  reason?: string,
  fieldPath?: string,
): value is T => {
  if (typeof value !== 'string' || !allowedValues.includes(value as T)) {
    logContentError(
      resolveContext(ctx, fieldPath),
      reason ??
        `Value must be one of: ${allowedValues.join(', ')}`,
    );
    return false;
  }

  return true;
};

export const validateNonEmptyArray = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a non-empty array',
  fieldPath?: string,
): value is unknown[] => {
  if (!Array.isArray(value) || value.length === 0) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

export const validateNonEmptyStringArray = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a non-empty array of non-empty strings',
  fieldPath?: string,
): value is string[] => {
  if (!validateNonEmptyArray(value, ctx, reason, fieldPath)) {
    return false;
  }

  for (let index = 0; index < value.length; index++) {
    const item = value[index];
    if (typeof item !== 'string' || item.length === 0) {
      logContentError(
        resolveContext(ctx, fieldPath ? `${fieldPath}[${index}]` : `[${index}]`),
        'Array items must be non-empty strings',
      );
      return false;
    }
  }

  return true;
};

const DAMAGE_SOURCE_TYPES: readonly DamageSourceType[] = [
  'all',
  'anvil',
  'block_explosion',
  'campfire',
  'charging',
  'contact',
  'drowning',
  'entity_attack',
  'entity_explosion',
  'fall',
  'falling_block',
  'fire',
  'fire_tick',
  'fireworks',
  'fly_into_wall',
  'freezing',
  'lava',
  'lightning',
  'magic',
  'magma',
  'none',
  'override',
  'piston',
  'projectile',
  'ram_attack',
  'self_destruct',
  'sonic_boom',
  'soul_campfire',
  'stalactite',
  'stalagmite',
  'starve',
  'suffocation',
  'temperature',
  'thorns',
  'void',
  'wither',
];

export const validateDamageSourceArray = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  fieldPath = 'causes',
): value is DamageSourceType[] => {
  if (
    !validateNonEmptyStringArray(
      value,
      ctx,
      'Absorbable causes must be a non-empty array',
      fieldPath,
    )
  ) {
    return false;
  }

  for (let index = 0; index < value.length; index++) {
    const cause = value[index];
    if (!DAMAGE_SOURCE_TYPES.includes(cause as DamageSourceType)) {
      logContentError(
        resolveContext(ctx, `${fieldPath}[${index}]`),
        `Invalid absorbable cause: ${cause}`,
      );
      return false;
    }
  }

  return true;
};

export const validateCustomComponentIds = (
  values: unknown,
  ctx: ContentDiagnosticContext | undefined,
): values is string[] => {
  if (!Array.isArray(values) || values.length === 0) {
    return false;
  }

  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (typeof value !== 'string' || value.length === 0) {
      logContentError(
        resolveContext(ctx, `[${index}]`),
        'Custom components must be non-empty strings',
      );
      return false;
    }
  }

  return true;
};
