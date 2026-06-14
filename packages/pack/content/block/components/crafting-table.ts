import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '@artifex/common/content/validation/content-validation';

import { CraftingTableComponent } from '../interfaces/block-config';

/**
 * Creates a crafting_table component for Minecraft blocks
 */
export const createCraftingTable = (
  options?: CraftingTableComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:crafting_table': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.craftingTags)) {
    for (let index = 0; index < options.craftingTags.length; index++) {
      const tag = options.craftingTags[index];
      if (typeof tag !== 'string' || tag.length < 1 || tag.length > 64) {
        logContentError(
          ctx !== undefined
            ? { ...ctx, fieldPath: `craftingTags[${index}]` }
            : undefined,
          'Crafting tags must be a string array with 1-64 characters',
        );
        return undefined;
      }
    }
    result.crafting_tags = options.craftingTags;
  }

  if (options.tableName !== undefined) {
    if (
      !validateNonEmptyString(
        options.tableName,
        ctx,
        'Table name must be a non-empty string',
        'tableName',
      )
    ) {
      return undefined;
    }
    result.table_name = options.tableName;
  }

  return {
    'minecraft:crafting_table': result,
  };
};
