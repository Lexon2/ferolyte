import { IsCollidableComponent } from '../../../interfaces/components/states/is-collidable-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsCollidableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsCollidableComponent = (
  component: Partial<IsCollidableComponent>,
): { 'minecraft:is_collidable': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_collidable': result,
  };
};
