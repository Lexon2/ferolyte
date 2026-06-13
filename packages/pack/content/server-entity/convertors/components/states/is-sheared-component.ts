import { IsShearedComponent } from '../../../interfaces/components/states/is-sheared-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsShearedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsShearedComponent = (
  component: Partial<IsShearedComponent>,
): { 'minecraft:is_sheared': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_sheared': result,
  };
};
