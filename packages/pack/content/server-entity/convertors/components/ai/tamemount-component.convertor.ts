import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TamemountComponent } from '../../../interfaces/components/ai/tamemount-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a TamemountComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTamemountComponent = (
  component: Partial<TamemountComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:tamemount': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate attemptTemperMod
  if (component.attemptTemperMod !== undefined) {
    if (!validateNumber(component.attemptTemperMod, 'attemptTemperMod', 0, Number.MAX_SAFE_INTEGER)) {
      return undefined;
    }
    result.attempt_temper_mod = component.attemptTemperMod;
  }

  // Validate autoRejectItems
  if (component.autoRejectItems !== undefined) {
    if (!Array.isArray(component.autoRejectItems)) {
      console.error('autoRejectItems must be an array');

      return undefined;
    }

    const autoRejectItems = component.autoRejectItems.map((item, index) => {
      if (typeof item.item !== 'string') {
        console.error(`autoRejectItems[${index}].item must be a string`);

        return undefined;
      }
      return item.item;
    });

    if (autoRejectItems.includes(undefined)) {
      return undefined;
    }

    result.auto_reject_items = autoRejectItems;
  }

  // Validate feedText
  if (component.feedText !== undefined) {
    if (!validateString(component.feedText, 'feedText')) {
      return undefined;
    }
    result.feed_text = component.feedText;
  }

  // Validate feedItems
  if (component.feedItems !== undefined) {
    if (!Array.isArray(component.feedItems)) {
      console.error('feedItems must be an array');

      return undefined;
    }

    const feedItems = component.feedItems.map((item, index) => {
      if (typeof item.item !== 'string') {
        console.error(`feedItems[${index}].item must be a string`);

        return undefined;
      }

      const feedItem: any = {
        item: item.item
      };

      if (item.temperMod !== undefined) {
        if (!validateNumber(item.temperMod, `feedItems[${index}].temperMod`, 0, Number.MAX_SAFE_INTEGER)) {
          return undefined;
        }
        feedItem.temper_mod = item.temperMod;
      }

      return feedItem;
    });

    if (feedItems.includes(undefined)) {
      return undefined;
    }

    result.feed_items = feedItems;
  }

  // Validate maxTemper
  if (component.maxTemper !== undefined) {
    if (!validateNumber(component.maxTemper, 'maxTemper', 0, Number.MAX_SAFE_INTEGER)) {
      return undefined;
    }
    result.max_temper = component.maxTemper;
  }

  // Validate minTemper
  if (component.minTemper !== undefined) {
    if (!validateNumber(component.minTemper, 'minTemper', 0, Number.MAX_SAFE_INTEGER)) {
      return undefined;
    }
    result.min_temper = component.minTemper;
  }

  // Validate rideText
  if (component.rideText !== undefined) {
    if (!validateString(component.rideText, 'rideText')) {
      return undefined;
    }
    result.ride_text = component.rideText;
  }

  // Validate tameEvent
  if (component.tameEvent !== undefined) {
    const convertedTameEvent = convertTrigger(component.tameEvent, withFieldPath(ctx, 'tameEvent'));
    if (!convertedTameEvent) {
      return undefined;
    }
    result.tame_event = convertedTameEvent;
  }

  return {
    'minecraft:tamemount': result
  };
};
