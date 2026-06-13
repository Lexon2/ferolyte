import { TransientComponent } from '../../../interfaces/components/miscellaneous/transient-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a TransientComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTransientComponent = (
  component: Partial<TransientComponent>,
): { 'minecraft:transient': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:transient': result,
  };
};
