import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TransformationComponent } from '../../../interfaces/components/transformation-and-variants/transformation-component';
import { validateString } from '../../common/validation';
import { validateStringArray } from '../../common/validation';
import { validateNumberRange } from '../../common/validation';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a TransformationComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertTransformationComponent = (
  component: Partial<TransformationComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.add !== undefined) {
    if (component.add.componentGroups !== undefined) {
      if (!validateStringArray(component.add.componentGroups, 'add.componentGroups')) {
        return undefined;
      }
      result.add = {
        component_groups: component.add.componentGroups
      };
    }
  }

  if (component.beginTransformSound !== undefined) {
    if (!validateString(component.beginTransformSound, 'beginTransformSound')) {
      return undefined;
    }
    result.begin_transform_sound = component.beginTransformSound;
  }

  if (component.delay !== undefined) {
    if (typeof component.delay === 'number') {
      if (!validateNumberRange(component.delay, 0, Infinity, 'delay')) {
        return undefined;
      }
      result.delay = {
        value: component.delay
      };
    } else {
      const delayResult: Record<string, any> = {};

      if (component.delay.blockAssistChance !== undefined) {
        if (!validateNumberRange(component.delay.blockAssistChance, 0, 1, 'delay.blockAssistChance')) {
          return undefined;
        }
        delayResult.block_assist_chance = component.delay.blockAssistChance;
      }

      if (component.delay.blockChance !== undefined) {
        if (!validateNumberRange(component.delay.blockChance, 0, 1, 'delay.blockChance')) {
          return undefined;
        }
        delayResult.block_chance = component.delay.blockChance;
      }

      if (component.delay.blockMax !== undefined) {
        if (!validateNumberRange(component.delay.blockMax, 0, Infinity, 'delay.blockMax')) {
          return undefined;
        }
        delayResult.block_max = component.delay.blockMax;
      }

      if (component.delay.blockRadius !== undefined) {
        if (!validateNumberRange(component.delay.blockRadius, 0, Infinity, 'delay.blockRadius')) {
          return undefined;
        }
        delayResult.block_radius = component.delay.blockRadius;
      }

      if (component.delay.blockTypes !== undefined) {
        if (!validateStringArray(component.delay.blockTypes, 'delay.blockTypes')) {
          return undefined;
        }
        delayResult.block_types = component.delay.blockTypes;
      }

      if (component.delay.value !== undefined) {
        if (!validateNumberRange(component.delay.value, 0, Infinity, 'delay.value')) {
          return undefined;
        }
        delayResult.value = component.delay.value;
      }

      result.delay = delayResult;
    }
  }

  if (component.dropEquipment !== undefined) {
    if (!validateBoolean(component.dropEquipment, 'dropEquipment')) {
      return undefined;
    }
    result.drop_equipment = component.dropEquipment;
  }

  if (component.dropInventory !== undefined) {
    if (!validateBoolean(component.dropInventory, 'dropInventory')) {
      return undefined;
    }
    result.drop_inventory = component.dropInventory;
  }

  if (component.into !== undefined) {
    if (!validateString(component.into, 'into')) {
      return undefined;
    }
    result.into = component.into;
  }

  if (component.keepLevel !== undefined) {
    if (!validateBoolean(component.keepLevel, 'keepLevel')) {
      return undefined;
    }
    result.keep_level = component.keepLevel;
  }

  if (component.keepOwner !== undefined) {
    if (!validateBoolean(component.keepOwner, 'keepOwner')) {
      return undefined;
    }
    result.keep_owner = component.keepOwner;
  }

  if (component.preserveEquipment !== undefined) {
    if (!validateBoolean(component.preserveEquipment, 'preserveEquipment')) {
      return undefined;
    }
    result.preserve_equipment = component.preserveEquipment;
  }

  if (component.transformationSound !== undefined) {
    if (!validateString(component.transformationSound, 'transformationSound')) {
      return undefined;
    }
    result.transformation_sound = component.transformationSound;
  }

  return {
    'minecraft:transformation': result
  };
};
