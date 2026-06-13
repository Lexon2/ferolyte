import { RedstoneConsumerComponent } from '../interfaces/block-config';

/**
 * Creates a redstone_consumer component for Minecraft blocks
 */
export const createRedstoneConsumer = (
  options?: RedstoneConsumerComponent,
): { 'minecraft:redstone_consumer': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    typeof options.minPower !== 'number' ||
    options.minPower < 0 ||
    options.minPower > 15
  ) {
    console.error('Min power must be a number between 0 and 15');

    return undefined;
  }

  const result: any = {
    min_power: options.minPower,
  };

  if (options.propagatesPower !== undefined) {
    if (typeof options.propagatesPower !== 'boolean') {
      console.error('Propagates power must be a boolean');

      return undefined;
    }
    result.propagates_power = options.propagatesPower;
  }

  return {
    'minecraft:redstone_consumer': result,
  };
};
