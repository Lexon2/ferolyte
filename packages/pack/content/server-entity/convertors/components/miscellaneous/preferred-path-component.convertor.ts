import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { PreferredPathComponent } from '../../../interfaces/components/miscellaneous/preferred-path-component';
import { validateNumber, validateInteger } from '../../common/validation';

/**
 * Converts a PreferredPathComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPreferredPathComponent = (
  component: Partial<PreferredPathComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:preferred_path': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate defaultBlockCost
  if (component.defaultBlockCost !== undefined) {
    if (!validateNumber(component.defaultBlockCost, 'defaultBlockCost')) {
      return undefined;
    }
    result.default_block_cost = component.defaultBlockCost;
  }

  // Validate jumpCost
  if (component.jumpCost !== undefined) {
    if (!validateInteger(component.jumpCost, 'jumpCost')) {
      return undefined;
    }
    result.jump_cost = component.jumpCost;
  }

  // Validate maxFallBlocks
  if (component.maxFallBlocks !== undefined) {
    if (!validateInteger(component.maxFallBlocks, 'maxFallBlocks')) {
      return undefined;
    }
    result.max_fall_blocks = component.maxFallBlocks;
  }

  // Validate preferredPathBlocks
  if (component.preferredPathBlocks !== undefined) {
    if (!Array.isArray(component.preferredPathBlocks)) {
      console.error('preferredPathBlocks must be an array');

      return undefined;
    }

    result.preferred_path_blocks = component.preferredPathBlocks.map((block, index) => {
      const blockResult: any = {};

      // Validate cost
      if (!validateNumber(block.cost, `preferredPathBlocks[${index}].cost`)) {
        return undefined;
      }
      blockResult.cost = block.cost;

      // Validate blocks
      if (!Array.isArray(block.blocks)) {
        console.error(`preferredPathBlocks[${index}].blocks must be an array`);

        return undefined;
      }

      for (const blockName of block.blocks) {
        if (typeof blockName !== 'string') {
          console.error(`preferredPathBlocks[${index}].blocks must contain only strings`);

          return undefined;
        }
      }
      blockResult.blocks = block.blocks;

      return blockResult;
    }).filter(Boolean);

    if (result.preferred_path_blocks.includes(undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:preferred_path': result
  };
};
