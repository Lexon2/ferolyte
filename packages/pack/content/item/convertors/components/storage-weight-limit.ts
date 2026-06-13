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
): { 'minecraft:storage_weight_limit': any } | undefined => {
  if (!options) {
    // Empty component is valid for storage_weight_limit
    return undefined;
  }

  const result: any = {};

  if (options.maxWeightLimit !== undefined) {
    if (
      typeof options.maxWeightLimit !== 'number' ||
      options.maxWeightLimit <= 0 ||
      options.maxWeightLimit > 64
    ) {
      // @TODO: Add error handling
      console.error(
        'Max weight limit must be a positive number and less than 64',
      );

      return undefined;
    }
    result.max_weight_limit = options.maxWeightLimit;
  }

  return {
    'minecraft:storage_weight_limit': result,
  };
};
