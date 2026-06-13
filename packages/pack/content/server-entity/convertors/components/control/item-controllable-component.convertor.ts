import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ItemControllableComponent } from '../../../interfaces/components/control/item-controllable-component';
import { validateStringArray } from '../../common/validation';

/**
 * Converts an ItemControllableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertItemControllableComponent = (
  component: Partial<ItemControllableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:item_controllable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate controlItems
  if (component.controlItems !== undefined) {
    if (typeof component.controlItems === 'string') {
      result.control_items = [component.controlItems];
    } else if (Array.isArray(component.controlItems)) {
      if (!validateStringArray(component.controlItems, 'controlItems')) {
        return undefined;
      }
      result.control_items = component.controlItems;
    } else {
      console.error('controlItems must be a string or an array of strings');

      return undefined;
    }
  }

  return {
    'minecraft:item_controllable': result,
  };
};
