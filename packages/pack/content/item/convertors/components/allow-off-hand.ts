import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateBooleanValue } from '@artifex/common/content/validation/content-validation';

/**
 * Creates an allow_off_hand component for Minecraft items
 * @param value Whether the item can be held in the off-hand slot
 * @returns The allow_off_hand component in Minecraft format or undefined if validation fails
 */
export const createAllowOffHand = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:allow_off_hand': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Allow off hand must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:allow_off_hand': value,
  };
};
