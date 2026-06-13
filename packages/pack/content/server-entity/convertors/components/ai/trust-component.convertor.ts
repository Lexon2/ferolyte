import { TrustComponent } from '../../../interfaces/components/ai/trust-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a TrustComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTrustComponent = (
  component: Partial<TrustComponent>,
): { 'minecraft:trust': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:trust': result,
  };
};
