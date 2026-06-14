import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BribeableComponent } from '../../../interfaces/components/ai/bribeable-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a BribeableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBribeableComponent = (
  component: Partial<BribeableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:bribeable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate bribeCooldown
  if (component.bribeCooldown !== undefined) {
    if (!validateNumber(component.bribeCooldown, 'bribeCooldown', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.bribe_cooldown = component.bribeCooldown;
  }

  // Validate bribeItems
  if (component.bribeItems !== undefined) {
    if (!Array.isArray(component.bribeItems)) {
      console.error('bribeItems must be an array');

      return undefined;
    }

    const validatedItems = component.bribeItems.map((item, index) => {
      if (!validateString(item, `bribeItems[${index}]`)) {
        return undefined;
      }
      return item;
    });

    if (validatedItems.includes(undefined)) {
      return undefined;
    }

    result.bribe_items = validatedItems;
  }

  return {
    'minecraft:bribeable': result,
  };
};
