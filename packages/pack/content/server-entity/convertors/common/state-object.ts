import { StateObject } from '../../../common/interfaces/state-object';

/**
 * Converts a StateObject to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertStateObject = (
  component: Partial<StateObject>,
): any | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value !== undefined && !component.value) {
    return undefined;
  }

  return {};
};
