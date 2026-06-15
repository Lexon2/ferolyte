import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { RavagerBlockedComponent } from '../../../interfaces/components/miscellaneous/ravager-blocked-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a RavagerBlockedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRavagerBlockedComponent = (
  component: Partial<RavagerBlockedComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:ravager_blocked': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate knockbackStrength
  if (component.knockbackStrength !== undefined) {
    if (!validateNumber(component.knockbackStrength, 'knockbackStrength')) {
      return undefined;
    }
    result.knockback_strength = component.knockbackStrength;
  }

  // Validate reactionChoices
  if (component.reactionChoices !== undefined) {
    if (!Array.isArray(component.reactionChoices)) {
      console.error('reactionChoices must be an array');

      return undefined;
    }

    result.reaction_choices = component.reactionChoices.map((choice, index) => {
      if (
        typeof choice.weight !== 'number' ||
        !Number.isInteger(choice.weight)
      ) {
        console.error(`reactionChoices[${index}].weight must be an integer`);

        return undefined;
      }

      const convertedValue = convertTrigger(
        choice.value,
        withFieldPath(ctx, 'value'),
      );
      if (!convertedValue) {
        return undefined;
      }

      return {
        weight: choice.weight,
        value: convertedValue,
      };
    });

    if (result.reaction_choices.includes(undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:ravager_blocked': result,
  };
};
