interface BlockPlacerOptions {
  block: string;
  useOn?: string[];
  replaceBlockItem?: boolean;
  alignedPlacement?: boolean;
}

/**
 * Creates a block_placer component for Minecraft items
 * @param options The block placer options
 * @returns The block_placer component in Minecraft format or undefined if validation fails
 */
export const createBlockPlacer = (
  options?: BlockPlacerOptions,
): { 'minecraft:block_placer': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (typeof options.block !== 'string' || options.block.length === 0) {
    // @TODO: Add error handling
    console.error('Block must be a non-empty string');

    return undefined;
  }

  const result: any = {
    block: options.block,
  };

  // Add optional properties if they exist
  if (Array.isArray(options.useOn) && options.useOn.length > 0) {
    result.use_on = options.useOn.map((tag) => ({ tags: tag }));
  }

  if (typeof options.replaceBlockItem === 'boolean') {
    result.replace_block_item = options.replaceBlockItem;
  }

  if (typeof options.alignedPlacement === 'boolean') {
    result.aligned_placement = options.alignedPlacement;
  }

  return {
    'minecraft:block_placer': result,
  };
};
