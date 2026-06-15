import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateDamageSourceArray } from '@ferolyte/common/content/validation/content-validation';

interface DamageAbsorptionOptions {
  causes: string[];
}

/**
 * Creates a damage_absorption component for Minecraft items
 * @param options The damage absorption options
 * @returns The damage_absorption component in Minecraft format or undefined if validation fails
 */
export const createDamageAbsorption = (
  options?: DamageAbsorptionOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:damage_absorption': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (!validateDamageSourceArray(options.causes, ctx)) {
    return undefined;
  }

  return {
    'minecraft:damage_absorption': {
      absorbable_causes: [...options.causes],
    },
  };
};
