import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateBooleanValue } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a fire_resistant component for Minecraft items
 * @param value Whether the item is immune to burning when dropped in fire or lava
 * @returns The fire_resistant component in Minecraft format or undefined if validation fails
 */
export const createFireResistant = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:fire_resistant': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Fire resistant must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:fire_resistant': value,
  };
};
