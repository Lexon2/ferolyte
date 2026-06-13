import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { InventoryComponent } from '../../../interfaces/components/interaction/inventory-component';
import { validateNumberRange } from '../../common/validation';
import { validateContainerType } from '../../common/validation';
import { validateBoolean } from '../../common/validation';

/**
 * Converts an InventoryComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertInventoryComponent = (
  component: Partial<InventoryComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:inventory': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate additionalSlotsPerStrength
  if (component.additionalSlotsPerStrength !== undefined) {
    if (!validateNumberRange(component.additionalSlotsPerStrength, 0, Number.MAX_VALUE, 'additionalSlotsPerStrength')) {
      return undefined;
    }
    result.additional_slots_per_strength = component.additionalSlotsPerStrength;
  }

  // Validate canBeSiphonedFrom
  if (component.canBeSiphonedFrom !== undefined) {
    if (!validateBoolean(component.canBeSiphonedFrom, 'canBeSiphonedFrom')) {
      return undefined;
    }
    result.can_be_siphoned_from = component.canBeSiphonedFrom;
  }

  // Validate containerType
  if (component.containerType !== undefined) {
    if (!validateContainerType(component.containerType, 'containerType')) {
      return undefined;
    }
    result.container_type = component.containerType;
  }

  // Validate inventorySize
  if (component.inventorySize !== undefined) {
    if (!validateNumberRange(component.inventorySize, 1, Number.MAX_VALUE, 'inventorySize')) {
      return undefined;
    }
    result.inventory_size = component.inventorySize;
  }

  // Validate private
  if (component.private !== undefined) {
    if (!validateBoolean(component.private, 'private')) {
      return undefined;
    }
    result.private = component.private;
  }

  // Validate restrictToOwner
  if (component.restrictToOwner !== undefined) {
    if (!validateBoolean(component.restrictToOwner, 'restrictToOwner')) {
      return undefined;
    }
    result.restrict_to_owner = component.restrictToOwner;
  }

  return {
    'minecraft:inventory': result
  };
};
