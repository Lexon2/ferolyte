import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateBooleanValue } from '../../../../common/validation/content-validation';

/**
 * Creates a glint component for Minecraft items
 * @param value Whether the item has an enchantment glint
 * @returns The glint component in Minecraft format or undefined if validation fails
 */
export const createGlint = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:glint': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Glint must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:glint': value,
  };
};
