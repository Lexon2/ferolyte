import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EquipItemComponent } from '../../../interfaces/components/interaction/equip-item-component';

interface ExcludedItem {
  item: string;
}

/**
 * Converts an EquipItemComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertEquipItemComponent = (
  component: Partial<EquipItemComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:equip_item': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate excludedItems if present
  if (component.excludedItems !== undefined) {
    if (!Array.isArray(component.excludedItems)) {
      console.error('excludedItems must be an array');

      return undefined;
    }

    for (const item of component.excludedItems) {
      if (typeof item !== 'object' || item === null) {
        console.error('excludedItems must contain objects');

        return undefined;
      }

      if (typeof item.item !== 'string') {
        console.error('item in excludedItems must be a string');

        return undefined;
      }
    }

    result.excluded_items = component.excludedItems.map(
      (item: ExcludedItem) => ({
        item: item.item,
      }),
    );
  }

  return {
    'minecraft:equip_item': result,
  };
};
