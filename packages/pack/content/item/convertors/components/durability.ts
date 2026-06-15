import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validatePositiveNumber } from '@ferolyte/common/content/validation/content-validation';

interface DamageChance {
  min: number;
  max: number;
}

interface DurabilityOptions {
  maxDurability: number;
  damageChance?: DamageChance;
}

/**
 * Creates a durability component for Minecraft items
 * @param options The durability options
 * @returns The durability component in Minecraft format or undefined if validation fails
 */
export const createDurability = (
  options?: DurabilityOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:durability': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validatePositiveNumber(
      options.maxDurability,
      ctx,
      'Max durability must be a positive number',
      'maxDurability',
    )
  ) {
    return undefined;
  }

  const result: any = {
    max_durability: options.maxDurability,
  };

  if (options.damageChance) {
    const { min, max } = options.damageChance;
    if (
      typeof min !== 'number' ||
      typeof max !== 'number' ||
      min < 0 ||
      max > 100 ||
      min > max
    ) {
      logContentError(
        ctx !== undefined ? { ...ctx, fieldPath: 'damageChance' } : undefined,
        'Damage chance must have valid min/max values between 0 and 100',
      );
      return undefined;
    }

    result.damage_chance = {
      min: options.damageChance.min,
      max: options.damageChance.max,
    };
  }

  return {
    'minecraft:durability': result,
  };
};
