import { ManagedWanderingTraderComponent } from '../../../interfaces/components/ai/managed-wandering-trader-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a ManagedWanderingTraderComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertManagedWanderingTraderComponent = (
  component: Partial<ManagedWanderingTraderComponent>,
): { 'minecraft:managed_wandering_trader': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:managed_wandering_trader': result,
  };
};
