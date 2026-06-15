import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BoostableComponent } from '../../../interfaces/components/control/boostable-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a boost item object
 * @param item The item to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the item is valid
 */
const validateBoostItem = (
  item: { damage?: number; item?: string; replaceItem?: string },
  fieldName: string,
): boolean => {
  if (item.damage !== undefined) {
    if (
      !validateNumber(item.damage, `${fieldName}.damage`, 0, Number.MAX_VALUE)
    ) {
      return false;
    }
  }

  if (item.item !== undefined) {
    if (!validateString(item.item, `${fieldName}.item`)) {
      return false;
    }
  }

  if (item.replaceItem !== undefined) {
    if (!validateString(item.replaceItem, `${fieldName}.replaceItem`)) {
      return false;
    }
  }

  return true;
};

/**
 * Converts a BoostableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBoostableComponent = (
  component: Partial<BoostableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:boostable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate duration
  if (component.duration !== undefined) {
    if (!validateNumber(component.duration, 'duration', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.duration = component.duration;
  }

  // Validate speedMultiplier
  if (component.speedMultiplier !== undefined) {
    if (
      !validateNumber(
        component.speedMultiplier,
        'speedMultiplier',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.speed_multiplier = component.speedMultiplier;
  }

  // Validate boostItems
  if (component.boostItems !== undefined) {
    if (!Array.isArray(component.boostItems)) {
      console.error('boostItems must be an array');

      return undefined;
    }

    const validatedItems = component.boostItems.map((item, index) => {
      if (!validateBoostItem(item, `boostItems[${index}]`)) {
        return undefined;
      }

      const validatedItem: any = {};
      if (item.damage !== undefined) {
        validatedItem.damage = item.damage;
      }
      if (item.item !== undefined) {
        validatedItem.item = item.item;
      }
      if (item.replaceItem !== undefined) {
        validatedItem.replace_item = item.replaceItem;
      }
      return validatedItem;
    });

    if (validatedItems.includes(undefined)) {
      return undefined;
    }

    result.boost_items = validatedItems;
  }

  return {
    'minecraft:boostable': result,
  };
};
