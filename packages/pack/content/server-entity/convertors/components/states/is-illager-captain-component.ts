import { IsIllagerCaptainComponent } from '../../../interfaces/components/states/is-illager-captain-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsIllagerCaptainComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsIllagerCaptainComponent = (
  component: Partial<IsIllagerCaptainComponent>,
): { 'minecraft:is_illager_captain': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_illager_captain': result,
  };
};
