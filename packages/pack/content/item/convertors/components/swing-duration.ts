import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonNegativeNumber } from '@artifex/common/content/validation/content-validation';

interface SwingDurationOptions {
  value?: number;
}

/**
 * Creates a swing_duration component for Minecraft items
 * @param options The swing duration options
 * @returns The swing_duration component in Minecraft format or undefined if validation fails
 */
export const createSwingDuration = (
  options?: SwingDurationOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:swing_duration': { value: number } } | undefined => {
  if (!options || options.value === undefined) {
    return undefined;
  }

  if (
    !validateNonNegativeNumber(
      options.value,
      ctx,
      'Swing duration value must be a non-negative number',
      'value',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:swing_duration': {
      value: options.value,
    },
  };
};
