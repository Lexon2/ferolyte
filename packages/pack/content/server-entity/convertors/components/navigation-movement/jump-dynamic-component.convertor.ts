import { JumpDynamicComponent } from '../../../interfaces/components/navigation-movement/jump-dynamic-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a JumpDynamicComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertJumpDynamicComponent = (
  component: Partial<JumpDynamicComponent>,
): { 'minecraft:jump.dynamic': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  // Jump dynamic component has no properties, just return empty object
  return {
    'minecraft:jump.dynamic': result,
  };
};
