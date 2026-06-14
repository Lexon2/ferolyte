import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNumberRange } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a friction component for Minecraft blocks
 * @param value The friction value (0.0-0.9)
 * @returns The friction component in Minecraft format or undefined if validation fails
 */
export const createFriction = (
  value?: number,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:friction': number } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateNumberRange(
      value,
      0,
      0.9,
      ctx,
      'Friction must be a number between 0.0 and 0.9',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:friction': value,
  };
};
