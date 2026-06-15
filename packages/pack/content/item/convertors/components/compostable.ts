import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNumberRange } from '@ferolyte/common/content/validation/content-validation';

interface CompostableOptions {
  compostingChance?: number;
}

/**
 * Creates a compostable component for Minecraft items
 * @param options The compostable options
 * @returns The compostable component in Minecraft format or undefined if validation fails
 */
export const createCompostable = (
  options?: CompostableOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:compostable': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNumberRange(
      options.compostingChance,
      1,
      100,
      ctx,
      'Composting chance must be a number between 1 and 100',
      'compostingChance',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:compostable': {
      composting_chance: options.compostingChance,
    },
  };
};
