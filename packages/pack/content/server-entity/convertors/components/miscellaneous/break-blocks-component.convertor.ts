import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { BreakBlocksComponent } from '../../../interfaces/components/miscellaneous/break-blocks-component';
import { validateString } from '../../common/validation';

/**
 * Converts a BreakBlocksComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBreakBlocksComponent = (
  component: Partial<BreakBlocksComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:break_blocks': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate breakableBlocks
  if (component.breakableBlocks !== undefined) {
    if (!Array.isArray(component.breakableBlocks)) {
      console.error('breakableBlocks must be an array');

      return undefined;
    }

    const validatedBlocks = component.breakableBlocks.map((block, index) => {
      if (!validateString(block, `breakableBlocks[${index}]`)) {
        return undefined;
      }
      return block;
    });

    if (validatedBlocks.includes(undefined)) {
      return undefined;
    }

    result.breakable_blocks = validatedBlocks;
  }

  return {
    'minecraft:break_blocks': result,
  };
};
