import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateIntegerRange } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a light_emission component for Minecraft blocks
 * @param value The light emission value (0-15)
 * @returns The light_emission component in Minecraft format or undefined if validation fails
 */
export const createLightEmission = (
  value?: number,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:light_emission': number } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateIntegerRange(
      value,
      0,
      15,
      ctx,
      'Light emission must be an integer between 0 and 15',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:light_emission': value,
  };
};
