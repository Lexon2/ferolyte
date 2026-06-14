import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@artifex/common/content/validation/content-validation';

interface CooldownOptions {
  category: string;
  duration: number;
  type?: 'use' | 'attack';
}

/**
 * Creates a cooldown component for Minecraft items
 * @param options The cooldown options
 * @returns The cooldown component in Minecraft format or undefined if validation fails
 */
export const createCooldown = (
  options?: CooldownOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:cooldown': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNonEmptyString(
      options.category,
      ctx,
      'Cooldown category must be a non-empty string',
      'category',
    )
  ) {
    return undefined;
  }

  if (
    !validatePositiveNumber(
      options.duration,
      ctx,
      'Cooldown duration must be a positive number',
      'duration',
    )
  ) {
    return undefined;
  }

  const result: Record<string, unknown> = {
    category: options.category,
    duration: options.duration,
  };

  if (options.type !== undefined) {
    if (
      !validateAllowedValue(
        options.type,
        ['use', 'attack'],
        ctx,
        'Cooldown type must be "use" or "attack"',
        'type',
      )
    ) {
      return undefined;
    }
    result.type = options.type;
  }

  return {
    'minecraft:cooldown': result,
  };
};
