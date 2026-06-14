import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validatePositiveNumber } from '@artifex/common/content/validation/content-validation';

interface FuelOptions {
  duration: number;
}

/**
 * Creates a fuel component for Minecraft items
 * @param options The fuel options
 * @returns The fuel component in Minecraft format or undefined if validation fails
 */
export const createFuel = (
  options?: FuelOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:fuel': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validatePositiveNumber(
      options.duration,
      ctx,
      'Fuel duration must be a positive number',
      'duration',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:fuel': {
      duration: options.duration,
    },
  };
};
