import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';

/**
 * Creates an interact_button component for Minecraft items
 * @param value Whether the interact button is shown in touch controls, or custom button text
 * @returns The interact_button component in Minecraft format or undefined if validation fails
 */
export const createInteractButton = (
  value?: boolean | string,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:interact_button': boolean | string } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean' && typeof value !== 'string') {
    logContentError(ctx, 'Interact button must be a boolean or string');
    return undefined;
  }

  return {
    'minecraft:interact_button': value,
  };
};
