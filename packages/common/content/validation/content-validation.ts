import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '../diagnostics/content-diagnostic';
import { DamageSourceType } from '../types/damage-source';

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

export const validateVector3 = (
  value: unknown,
  ctx: ContentDiagnosticContext | undefined,
  reason = 'Value must be a Vector3 array with 3 numeric values',
  fieldPath?: string,
): value is [number, number, number] => {
  if (
    !Array.isArray(value) ||
    value.length !== 3 ||
    !value.every((n) => typeof n === 'number' && !Number.isNaN(n))
  ) {
    logContentError(resolveContext(ctx, fieldPath), reason);
    return false;
  }

  return true;
};

