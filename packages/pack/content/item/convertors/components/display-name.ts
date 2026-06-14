import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '@artifex/common/content/validation/content-validation';

export const createDisplayName = (
  name: string,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:display_name': any } | undefined => {
  if (!validateNonEmptyString(name, ctx, 'Display name must be a non-empty string')) {
    return;
  }

  return {
    'minecraft:display_name': {
      value: name,
    },
  };
};
