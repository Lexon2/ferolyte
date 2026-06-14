import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AgeableComponent } from '../../../interfaces/components/miscellaneous/ageable-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a feed item object
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateFeedItem = (
  value: { growth?: number; item: string },
  fieldName: string,
): boolean => {
  if (!validateString(value.item, `${fieldName}.item`)) {
    return false;
  }
  if (value.growth !== undefined) {
    if (!validateNumber(value.growth, `${fieldName}.growth`, 0, Number.MAX_VALUE)) {
      return false;
    }
  }
  return true;
};

/**
 * Converts an AgeableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAgeableComponent = (
  component: Partial<AgeableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:ageable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate dropItems
  if (component.dropItems !== undefined) {
    if (typeof component.dropItems === 'string') {
      if (!validateString(component.dropItems, 'dropItems')) {
        return undefined;
      }
      result.drop_items = component.dropItems;
    } else if (Array.isArray(component.dropItems)) {
      for (const item of component.dropItems) {
        if (!validateString(item, 'dropItems item')) {
          return undefined;
        }
      }
      result.drop_items = component.dropItems;
    } else {
      console.error('dropItems must be a string or array of strings');

      return undefined;
    }
  }

  // Validate duration
  if (component.duration !== undefined) {
    if (!validateNumber(component.duration, 'duration', -1, Number.MAX_VALUE)) {
      return undefined;
    }
    result.duration = component.duration;
  }

  // Validate feedItems
  if (component.feedItems !== undefined) {
    if (typeof component.feedItems === 'string') {
      if (!validateString(component.feedItems, 'feedItems')) {
        return undefined;
      }
      result.feed_items = component.feedItems;
    } else if (Array.isArray(component.feedItems)) {
      for (const item of component.feedItems) {
        if (typeof item === 'string') {
          if (!validateString(item, 'feedItems item')) {
            return undefined;
          }
        } else if (typeof item === 'object') {
          if (!validateFeedItem(item, 'feedItems item')) {
            return undefined;
          }
        } else {
          console.error('feedItems array items must be strings or objects with item and optional growth');

          return undefined;
        }
      }
      result.feed_items = component.feedItems;
    } else {
      console.error('feedItems must be a string or array of strings/objects');

      return undefined;
    }
  }

  // Validate growUp
  if (component.growUp !== undefined) {
    const convertedGrowUp = convertTrigger(component.growUp, withFieldPath(ctx, 'growUp'));
    if (!convertedGrowUp) {
      return undefined;
    }
    result.grow_up = convertedGrowUp;
  }

  // Validate transformToItem
  if (component.transformToItem !== undefined) {
    if (!validateString(component.transformToItem, 'transformToItem')) {
      return undefined;
    }
    result.transform_to_item = component.transformToItem;
  }

  // Validate interactFilters
  if (component.interactFilters !== undefined) {
    const convertedFilters = convertEntityFilters(component.interactFilters, withFieldPath(ctx, 'interactFilters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.interact_filters = convertedFilters;
  }

  return {
    'minecraft:ageable': result,
  };
};
