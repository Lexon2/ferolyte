import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  HealableComponent,
  HealableEffect,
} from '../../../interfaces/components/miscellaneous/healable-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateBoolean,
  validateEffectType,
  validateNumber,
  validateString,
} from '../../common/validation';

/**
 * Validates a healable effect
 * @param effect The effect to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the effect is valid
 */
const convertHealableEffect = (
  effect: HealableEffect,
  fieldName: string,
): any | undefined => {
  if (!effect) {
    return false;
  }

  const result: any = {};
  // Validate name
  if (effect.name !== undefined) {
    if (!validateEffectType(effect.name, 'name')) {
      return undefined;
    }
    result.name = effect.name;
  }

  // Validate duration
  if (effect.duration !== undefined) {
    if (
      effect.duration !== 'infinite' &&
      !validateNumber(
        effect.duration,
        `${fieldName}.duration`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.duration = effect.duration;
  }

  // Validate amplifier
  if (effect.amplifier !== undefined) {
    if (
      !validateNumber(
        effect.amplifier,
        `${fieldName}.amplifier`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.amplifier = effect.amplifier;
  }

  return result;
};

/**
 * Validates a healable item
 * @param item The item to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the item is valid
 */
const convertHealableItem = (
  item: any,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!item) {
    return undefined;
  }

  const result: any = {};

  // Validate filters
  if (item.filters !== undefined) {
    const convertedFilters = convertEntityFilters(item.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate healAmount
  if (item.healAmount !== undefined) {
    if (
      !validateNumber(
        item.healAmount,
        `${fieldName}.healAmount`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.heal_amount = item.healAmount;
  }

  // Validate item
  if (item.item !== undefined) {
    if (!validateString(item.item, `${fieldName}.item`)) {
      return undefined;
    }
    result.item = item.item;
  }

  // Validate effects
  if (item.effects !== undefined) {
    if (Array.isArray(item.effects)) {
      const effects: Array<HealableEffect> = [];
      for (let i = 0; i < item.effects.length; i++) {
        const convertedEffect = convertHealableEffect(
          item.effects[i],
          `${fieldName}.effects[${i}]`,
        );
        if (!convertedEffect) {
          return undefined;
        }
        effects.push(convertedEffect);
      }
      result.effects = effects;
    } else {
      const convertedEffect = convertHealableEffect(
        item.effects,
        `${fieldName}.effects`,
      );
      if (!convertedEffect) {
        return undefined;
      }
      result.effects = convertedEffect;
    }
  }

  return result;
};

/**
 * Converts a HealableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHealableComponent = (
  component: Partial<HealableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:healable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate filters
  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate forceUse
  if (component.forceUse !== undefined) {
    if (!validateBoolean(component.forceUse, 'forceUse')) {
      return undefined;
    }
    result.force_use = component.forceUse;
  }

  // Validate items
  if (component.items !== undefined) {
    if (!Array.isArray(component.items)) {
      return undefined;
    }

    const validatedItems = component.items.map((item, index) => {
      const convertedItem = convertHealableItem(
        item,
        `items[${index}]`,
        withFieldPath(ctx, `items[${index}]`),
      );
      if (!convertedItem) {
        return undefined;
      }
      return convertedItem;
    });

    if (validatedItems.includes(undefined)) {
      return undefined;
    }

    result.items = validatedItems;
  }

  return {
    'minecraft:healable': result,
  };
};
