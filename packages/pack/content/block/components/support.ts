import { SupportComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_SUPPORT_SHAPES = ['fence', 'stair'] as const;

/**
 * Creates a support component for Minecraft blocks
 */
export const createSupport = (
  options?: SupportComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:support': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      options.shape,
      VALID_SUPPORT_SHAPES,
      ctx,
      'Support shape must be "fence" or "stair"',
      'shape',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:support': {
      shape: options.shape,
    },
  };
};
