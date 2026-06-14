import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { CustomHitTestComponent, Hitbox } from '../../../interfaces/components/physical/custom-hit-test-component';
import { validateNumber } from '../../common/validation';

/**
 * Validates a hitbox object
 * @param hitbox The hitbox to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the hitbox is valid
 */
const validateHitbox = (
  hitbox: Hitbox,
  fieldName: string,
): boolean => {
  if (!validateNumber(hitbox.width, `${fieldName}.width`, 0, Number.MAX_VALUE)) {
    return false;
  }

  if (!validateNumber(hitbox.height, `${fieldName}.height`, 0, Number.MAX_VALUE)) {
    return false;
  }

  if (!Array.isArray(hitbox.pivot) || hitbox.pivot.length !== 3) {
    console.error(`${fieldName}.pivot must be an array of three numbers`);

    return false;
  }

  for (let i = 0; i < 3; i++) {
    if (!validateNumber(hitbox.pivot[i], `${fieldName}.pivot[${i}]`, -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return false;
    }
  }

  return true;
};

/**
 * Converts a CustomHitTestComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCustomHitTestComponent = (
  component: Partial<CustomHitTestComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:custom_hit_test': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate hitboxes
  if (component.hitboxes !== undefined) {
    if (!Array.isArray(component.hitboxes)) {
      console.error('hitboxes must be an array');

      return undefined;
    }

    const validatedHitboxes = component.hitboxes.map((hitbox, index) => {
      if (!validateHitbox(hitbox, `hitboxes[${index}]`)) {
        return undefined;
      }

      return {
        width: hitbox.width,
        height: hitbox.height,
        pivot: hitbox.pivot,
      };
    });

    if (validatedHitboxes.includes(undefined)) {
      return undefined;
    }

    result.hitboxes = validatedHitboxes;
  }

  return {
    'minecraft:custom_hit_test': result,
  };
};
