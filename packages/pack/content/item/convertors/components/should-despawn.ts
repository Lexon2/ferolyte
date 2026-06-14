import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateBooleanValue } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a should_despawn component for Minecraft items
 * @param value Whether the item should despawn when dropped
 * @returns The should_despawn component in Minecraft format or undefined if validation fails
 */
export const createShouldDespawn = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:should_despawn': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Should despawn must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:should_despawn': value,
  };
};
