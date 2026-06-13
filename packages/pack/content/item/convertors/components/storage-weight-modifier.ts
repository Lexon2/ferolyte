import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateNonNegativeNumber } from '../../../../common/validation/content-validation';

interface StorageWeightModifierOptions {
  weightInStorageItem?: number;
}

/**
 * Creates a storage_weight_modifier component for Minecraft items
 * @param options The storage weight modifier options
 * @returns The storage_weight_modifier component in Minecraft format or undefined if validation fails
 */
export const createStorageWeightModifier = (
  options?: StorageWeightModifierOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:storage_weight_modifier': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.weightInStorageItem !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.weightInStorageItem,
        ctx,
        'Weight in storage item must be a non-negative number',
        'weightInStorageItem',
      )
    ) {
      return undefined;
    }
    result.weight_in_storage_item = options.weightInStorageItem;
  }

  return {
    'minecraft:storage_weight_modifier': result,
  };
};
