import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateBooleanValue } from '../../../../common/validation/content-validation';

/**
 * Creates a hand_equipped component for Minecraft items
 * @param value Whether the item is rendered in hand when equipped
 * @returns The hand_equipped component in Minecraft format or undefined if validation fails
 */
export const createHandEquipped = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:hand_equipped': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Hand equipped must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:hand_equipped': value,
  };
};
