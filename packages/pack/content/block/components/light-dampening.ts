import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateIntegerRange } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a light_dampening component for Minecraft blocks
 * @param value The light dampening value (0-15)
 * @returns The light_dampening component in Minecraft format or undefined if validation fails
 */
export const createLightDampening = (
  value?: number,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:light_dampening': number } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateIntegerRange(
      value,
      0,
      15,
      ctx,
      'Light dampening must be an integer between 0 and 15',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:light_dampening': value,
  };
};
