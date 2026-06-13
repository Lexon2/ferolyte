import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '../../../common/validation/content-validation';

/**
 * Creates a loot component for Minecraft blocks
 * @param value Path to the loot table file
 * @returns The loot component in Minecraft format or undefined if validation fails
 */
export const createLoot = (
  value?: string,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:loot': string } | undefined => {
  if (
    !validateNonEmptyString(
      value,
      ctx,
      'Loot must be a non-empty string path to a loot table',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:loot': value as string,
  };
};
