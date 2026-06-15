import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateBooleanValue } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a can_destroy_in_creative component for Minecraft items
 * @param value Whether the item can destroy blocks in creative mode
 * @returns The can_destroy_in_creative component in Minecraft format or undefined if validation fails
 */
export const createCanDestroyInCreative = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:can_destroy_in_creative': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateBooleanValue(
      value,
      ctx,
      'Can destroy in creative must be a boolean',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:can_destroy_in_creative': value,
  };
};
