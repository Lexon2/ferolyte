import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '../../../../common/validation/content-validation';

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
  ctx?: ContentDiagnosticContext,
): { 'minecraft:block_placer': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNonEmptyString(
      options.block,
      ctx,
      'Block must be a non-empty string',
      'block',
    )
  ) {
    return undefined;
  }

  const result: any = {
    block: options.block,
  };

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
