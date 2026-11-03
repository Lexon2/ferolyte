import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateString,
} from '@ferolyte/common/content/validation/content-validation';
import { ItemMenuCategory } from '../../../interfaces/item-menu-category';
import { ItemMenuCategoryType } from '../../../types/item-menu-category-type';

const VALID_CATEGORIES = [
  'construction',
  'equipment',
  'items',
  'nature',
  'none',
] as const;

/**
 * The game rejects a `menu_category.group` without a namespace ("string must be prefixed with a namespace") and
 * then drops the item's other components too. Vanilla `itemGroup.name.*` groups get the `minecraft:` prefix; any
 * other unprefixed value is an error (written as given).
 */
export const namespaceMenuGroup = (
  group: string,
  ctx?: ContentDiagnosticContext,
): string => {
  if (group.includes(':')) {
    return group;
  }
  if (group.startsWith('itemGroup.name.')) {
    return `minecraft:${group}`;
  }
  logContentError(
    ctx === undefined ? undefined : { ...ctx, fieldPath: 'group' },
    `menuCategory.group "${group}" must be prefixed with a namespace ("minecraft:itemGroup.name.<group>" or "<namespace>:<group>")`,
  );

  return group;
};

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

    result.group = namespaceMenuGroup(input.group, ctx);
  }

  return result as unknown as ItemMenuCategory;
};

export const validateCategory = (
  category: ItemMenuCategoryType,
): ItemMenuCategoryType | undefined => {
  return VALID_CATEGORIES.includes(
    category as (typeof VALID_CATEGORIES)[number],
  )
    ? category
    : undefined;
};
