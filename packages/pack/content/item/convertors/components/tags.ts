import { ItemTags } from '../../types/item-tags';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyArray } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a tags component for Minecraft items
 * @param values Array of tag strings
 * @returns The tags component in Minecraft format or undefined if validation fails
 */
export const createTags = (
  values?: ItemTags[],
  ctx?: ContentDiagnosticContext,
): { 'minecraft:tags': { tags: string[] } } | undefined => {
  if (!validateNonEmptyArray(values, ctx, 'Tags must be a non-empty array')) {
    return undefined;
  }

  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (typeof value !== 'string' || value.length === 0) {
      logContentError(
        ctx !== undefined ? { ...ctx, fieldPath: `[${index}]` } : undefined,
        'Tags must be non-empty strings',
      );
      return undefined;
    }
  }

  return {
    'minecraft:tags': {
      tags: values,
    },
  };
};
