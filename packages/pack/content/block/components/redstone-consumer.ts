import { RedstoneConsumerComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateIntegerRange,
} from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a redstone_consumer component for Minecraft blocks
 */
export const createRedstoneConsumer = (
  options?: RedstoneConsumerComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:redstone_consumer': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    !validateIntegerRange(
      options.minPower,
      0,
      15,
      ctx,
      'Min power must be a number between 0 and 15',
      'minPower',
    )
  ) {
    return undefined;
  }

  const result: any = {
    min_power: options.minPower,
  };

  if (options.propagatesPower !== undefined) {
    if (
      !validateBooleanValue(
        options.propagatesPower,
        ctx,
        'Propagates power must be a boolean',
        'propagatesPower',
      )
    ) {
      return undefined;
    }
    result.propagates_power = options.propagatesPower;
  }

  return {
    'minecraft:redstone_consumer': result,
  };
};
