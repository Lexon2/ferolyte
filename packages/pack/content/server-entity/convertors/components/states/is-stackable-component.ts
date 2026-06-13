import { IsStackableComponent } from '../../../interfaces/components/states/is-stackable-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsStackableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsStackableComponent = (
  component: Partial<IsStackableComponent>,
): { 'minecraft:is_stackable': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_stackable': result,
  };
};
