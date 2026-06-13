import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateNonNegativeNumber } from '../../../../common/validation/content-validation';

/**
 * Creates a damage component for Minecraft items
 * @param value The damage value for the item
 * @returns The damage component in Minecraft format or undefined if validation fails
 */
export const createDamage = (
  value?: number,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:damage': number } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateNonNegativeNumber(value, ctx, 'Damage must be a positive number')
  ) {
    return undefined;
  }

  return {
    'minecraft:damage': value,
  };
};
