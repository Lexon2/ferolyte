import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateIntegerRange } from '@ferolyte/common/content/validation/content-validation';

interface StorageWeightLimitOptions {
  maxWeightLimit?: number;
}

/**
 * Creates a storage_weight_limit component for Minecraft items
 * @param options The storage weight limit options
 * @returns The storage_weight_limit component in Minecraft format or undefined if validation fails
 */
export const createStorageWeightLimit = (
  options?: StorageWeightLimitOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:storage_weight_limit': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.maxWeightLimit !== undefined) {
    if (
      !validateIntegerRange(
        options.maxWeightLimit,
        1,
        64,
        ctx,
        'Max weight limit must be a positive number and less than 64',
        'maxWeightLimit',
      )
    ) {
      return undefined;
    }
    result.max_weight_limit = options.maxWeightLimit;
  }

  return {
    'minecraft:storage_weight_limit': result,
  };
};
