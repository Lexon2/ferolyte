import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateString,
} from '@artifex/common/content/validation/content-validation';
import { ItemMenuCategory } from '../../../interfaces/item-menu-category';
import { ItemMenuCategoryType } from '../../../types/item-menu-category-type';

const VALID_CATEGORIES = [
  'construction',
  'equipment',
  'items',
  'nature',
  'none',
] as const;

export const convertMenuCategory = (
  input: ItemMenuCategory,
  ctx?: ContentDiagnosticContext,
): ItemMenuCategory | undefined => {
  if (input.category === undefined) {
    logContentError(ctx, 'Menu category is required');
    return undefined;
  }

  if (
    !validateAllowedValue(
      input.category,
      VALID_CATEGORIES,
      ctx,
      `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      'category',
    )
  ) {
    return undefined;
  }

  const result: Record<string, unknown> = {
    category: input.category,
  };

  if (input.isHiddenInCommands !== undefined) {
    if (
      !validateBooleanValue(
        input.isHiddenInCommands,
        ctx,
        'isHiddenInCommands must be a boolean',
        'isHiddenInCommands',
      )
    ) {
      return undefined;
    }

    result.is_hidden_in_commands = input.isHiddenInCommands;
  }

  if (input.group !== undefined) {
    if (!validateString(input.group, ctx, 'group must be a string', 'group')) {
      return undefined;
    }

    result.group = input.group;
  }

  return result as ItemMenuCategory;
};

export const validateCategory = (
  category: ItemMenuCategoryType,
): ItemMenuCategoryType | undefined => {
  return VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
    ? category
    : undefined;
};
