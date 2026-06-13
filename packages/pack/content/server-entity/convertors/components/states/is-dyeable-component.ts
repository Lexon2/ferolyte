import { IsDyeableComponent } from '../../../interfaces/components/states/is-dyeable-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsDyeableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsDyeableComponent = (
  component: Partial<IsDyeableComponent>,
): { 'minecraft:is_dyeable': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  // Validate interactText
  if (component.interactText !== undefined) {
    if (typeof component.interactText !== 'string') {
      console.error('interactText must be a string');

      return undefined;
    }
    result.interact_text = component.interactText;
  }

  return {
    'minecraft:is_dyeable': result,
  };
};
