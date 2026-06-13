import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { logContentError } from '../../../../common/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateIntegerRange,
} from '../../../../common/validation/content-validation';

interface StorageItemOptions {
  allowNestedStorageItems?: boolean;
  allowedItems?: string[];
  bannedItems?: string[];
  maxSlots?: number;
}

/**
 * Creates a storage_item component for Minecraft items
 * @param options The storage item options
 * @returns The storage_item component in Minecraft format or undefined if validation fails
 */
export const createStorageItem = (
  options?: StorageItemOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:storage_item': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.allowNestedStorageItems !== undefined) {
    if (
      !validateBooleanValue(
        options.allowNestedStorageItems,
        ctx,
        'Allow nested storage items must be a boolean',
        'allowNestedStorageItems',
      )
    ) {
      return undefined;
    }
    result.allow_nested_storage_items = options.allowNestedStorageItems;
  }

  if (options.maxSlots !== undefined) {
    if (
      !validateIntegerRange(
        options.maxSlots,
        1,
        64,
        ctx,
        'Max slots must be a positive number',
        'maxSlots',
      )
    ) {
      return undefined;
    }
    result.max_slots = options.maxSlots;
  }

  if (Array.isArray(options.allowedItems)) {
    for (let index = 0; index < options.allowedItems.length; index++) {
      const item = options.allowedItems[index];
      if (typeof item !== 'string' || item.length === 0) {
        logContentError(
          ctx !== undefined
            ? { ...ctx, fieldPath: `allowedItems[${index}]` }
            : undefined,
          'Allowed items must be non-empty strings',
        );
        return undefined;
      }
    }
    result.allowed_items = options.allowedItems;
  }

  if (Array.isArray(options.bannedItems)) {
    for (let index = 0; index < options.bannedItems.length; index++) {
      const item = options.bannedItems[index];
      if (typeof item !== 'string' || item.length === 0) {
        logContentError(
          ctx !== undefined
            ? { ...ctx, fieldPath: `bannedItems[${index}]` }
            : undefined,
          'Banned items must be non-empty strings',
        );
        return undefined;
      }
    }
    result.banned_items = options.bannedItems;
  }

  return {
    'minecraft:storage_item': result,
  };
};
