import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { GiveableComponent } from '../../../interfaces/components/interaction/giveable-component';
import { validateStringArray } from '../../common/validation';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a GiveableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGiveableComponent = (
  component: Partial<GiveableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:giveable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate triggers if present
  if (component.triggers !== undefined) {
    if (typeof component.triggers !== 'object' || component.triggers === null) {
      console.error('triggers must be an object');

      return undefined;
    }

    const triggersResult: any = {};

    // Validate cooldown
    if (component.triggers.cooldown !== undefined) {
      if (
        !validateNumberRange(
          component.triggers.cooldown,
          0.0,
          Number.MAX_VALUE,
          'cooldown',
        )
      ) {
        return undefined;
      }
      triggersResult.cooldown = component.triggers.cooldown;
    }

    // Validate items
    if (component.triggers.items !== undefined) {
      if (!validateStringArray(component.triggers.items, 'items')) {
        return undefined;
      }
      triggersResult.items = component.triggers.items;
    }

    // Validate onGive
    if (component.triggers.onGive !== undefined) {
      if (
        typeof component.triggers.onGive !== 'object' ||
        component.triggers.onGive === null
      ) {
        console.error('onGive must be an object');

        return undefined;
      }
      triggersResult.on_give = component.triggers.onGive;
    }

    result.triggers = triggersResult;
  }

  return {
    'minecraft:giveable': result,
  };
};
