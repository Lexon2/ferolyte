import { TickComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateBooleanValue } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a tick component for Minecraft blocks
 */
export const createTick = (
  options?: TickComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:tick': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.looping !== undefined) {
    if (
      !validateBooleanValue(
        options.looping,
        ctx,
        'Looping must be a boolean',
        'looping',
      )
    ) {
      return undefined;
    }
    result.looping = options.looping;
  }

  if (options.intervalRange !== undefined) {
    if (
      !Array.isArray(options.intervalRange) ||
      options.intervalRange.length !== 2 ||
      !options.intervalRange.every((val) => typeof val === 'number') ||
      options.intervalRange[0] > options.intervalRange[1]
    ) {
      logContentError(
        ctx !== undefined ? { ...ctx, fieldPath: 'intervalRange' } : undefined,
        'Interval range must be an array with two numbers, where first ≤ second',
      );
      return undefined;
    }
    result.interval_range = options.intervalRange;
  }

  return {
    'minecraft:tick': result,
  };
};
