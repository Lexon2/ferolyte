import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { validateCustomComponentIds } from '../../../common/validation/content-validation';

/**
 * Creates a custom_components component for Minecraft blocks
 * @param values Array of custom component identifiers
 * @returns The custom_components component in Minecraft format or undefined if validation fails
 */
export const createCustomComponents = (
  values?: string[],
  ctx?: ContentDiagnosticContext,
): { 'minecraft:custom_components': string[] } | undefined => {
  if (
    !validateCustomComponentIds(values, {
      contentType: 'block',
      ...ctx,
    })
  ) {
    return undefined;
  }

  return {
    'minecraft:custom_components': values as string[],
  };
};
