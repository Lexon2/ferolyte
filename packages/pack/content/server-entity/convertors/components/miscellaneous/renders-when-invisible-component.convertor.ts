import { RendersWhenInvisibleComponent } from '../../../interfaces/components/miscellaneous/renders-when-invisible-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a RendersWhenInvisibleComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRendersWhenInvisibleComponent = (
  component: Partial<RendersWhenInvisibleComponent>,
): { 'minecraft:renders_when_invisible': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:renders_when_invisible': result,
  };
};
