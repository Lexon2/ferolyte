import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { ShareablesComponent } from '../../../interfaces/components/miscellaneous/shareables-component';
import {
  validateBoolean,
  validateInteger,
  validateString,
} from '../../common/validation';

/**
 * Converts a ShareablesComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertShareablesComponent = (
  component: Partial<ShareablesComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:shareables': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.allItems !== undefined) {
    if (!validateBoolean(component.allItems, 'allItems', ctx)) {
      return undefined;
    }
    result.all_items = component.allItems;
  }

  if (component.allItemsMaxAmount !== undefined) {
    if (!validateInteger(component.allItemsMaxAmount, 'allItemsMaxAmount', undefined, undefined, ctx)) {
      return undefined;
    }
    result.all_items_max_amount = component.allItemsMaxAmount;
  }

  if (component.allItemsSurplusAmount !== undefined) {
    if (!validateInteger(component.allItemsSurplusAmount, 'allItemsSurplusAmount', undefined, undefined, ctx)) {
      return undefined;
    }
    result.all_items_surplus_amount = component.allItemsSurplusAmount;
  }

  if (component.allItemsWantAmount !== undefined) {
    if (!validateInteger(component.allItemsWantAmount, 'allItemsWantAmount', undefined, undefined, ctx)) {
      return undefined;
    }
    result.all_items_want_amount = component.allItemsWantAmount;
  }

  if (component.singularPickup !== undefined) {
    if (!validateBoolean(component.singularPickup, 'singularPickup', ctx)) {
      return undefined;
    }
    result.singular_pickup = component.singularPickup;
  }

  if (component.items !== undefined) {
    const items = component.items.map((item, index) => {
      const itemResult: Record<string, unknown> = {};

      if (!validateString(item.item, `items[${index}].item`, ctx)) {
        return undefined;
      }
      itemResult.item = item.item;

      if (item.admire !== undefined) {
        if (!validateBoolean(item.admire, `items[${index}].admire`, ctx)) {
          return undefined;
        }
        itemResult.admire = item.admire;
      }

      if (item.barter !== undefined) {
        if (!validateBoolean(item.barter, `items[${index}].barter`, ctx)) {
          return undefined;
        }
        itemResult.barter = item.barter;
      }

      if (item.consumeItem !== undefined) {
        if (!validateBoolean(item.consumeItem, `items[${index}].consumeItem`, ctx)) {
          return undefined;
        }
        itemResult.consume_item = item.consumeItem;
      }

      if (item.craftInto !== undefined) {
        if (!validateString(item.craftInto, `items[${index}].craftInto`, ctx)) {
          return undefined;
        }
        itemResult.craft_into = item.craftInto;
      }

      if (item.itemAux !== undefined) {
        if (!validateInteger(item.itemAux, `items[${index}].itemAux`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.item_aux = item.itemAux;
      }

      if (item.maxAmount !== undefined) {
        if (!validateInteger(item.maxAmount, `items[${index}].maxAmount`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.max_amount = item.maxAmount;
      }

      if (item.pickupLimit !== undefined) {
        if (!validateInteger(item.pickupLimit, `items[${index}].pickupLimit`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.pickup_limit = item.pickupLimit;
      }

      if (item.priority !== undefined) {
        if (!validateInteger(item.priority, `items[${index}].priority`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.priority = item.priority;
      }

      if (item.storedInInventory !== undefined) {
        if (!validateBoolean(item.storedInInventory, `items[${index}].storedInInventory`, ctx)) {
          return undefined;
        }
        itemResult.stored_in_inventory = item.storedInInventory;
      }

      if (item.surplusAmount !== undefined) {
        if (!validateInteger(item.surplusAmount, `items[${index}].surplusAmount`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.surplus_amount = item.surplusAmount;
      }

      if (item.wantAmount !== undefined) {
        if (!validateInteger(item.wantAmount, `items[${index}].wantAmount`, undefined, undefined, ctx)) {
          return undefined;
        }
        itemResult.want_amount = item.wantAmount;
      }

      if (item.pickupOnly !== undefined) {
        if (!validateBoolean(item.pickupOnly, `items[${index}].pickupOnly`, ctx)) {
          return undefined;
        }
        itemResult.pickup_only = item.pickupOnly;
      }

      return itemResult;
    });

    if (items.some((item) => item === undefined)) {
      return undefined;
    }

    result.items = items;
  }

  return {
    'minecraft:shareables': result,
  };
};
