import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateIntegerRange } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a max_stack_size component for Minecraft items
 * @param value The maximum stack size for the item from 1 to 64
 * @returns The max_stack_size component in Minecraft format or undefined if validation fails
 */
export const createMaxStackSize = (
  value?: number,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:max_stack_size': number } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateIntegerRange(
      value,
      1,
      64,
      ctx,
      'Max stack size must be from 1 to 64',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:max_stack_size': value,
  };
};
