import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonNegativeNumber } from '@artifex/common/content/validation/content-validation';

/**
 * Creates an entity_fall_on component for Minecraft blocks
 */
export const createEntityFallOn = (
  options?: { minFallDistance?: number },
  ctx?: ContentDiagnosticContext,
): { 'minecraft:entity_fall_on': { min_fall_distance?: number } } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: { min_fall_distance?: number } = {};

  if (options.minFallDistance !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.minFallDistance,
        ctx,
        'Minimum fall distance must be a non-negative number',
        'minFallDistance',
      )
    ) {
      return undefined;
    }
    result.min_fall_distance = options.minFallDistance;
  }

  return {
    'minecraft:entity_fall_on': result,
  };
};
