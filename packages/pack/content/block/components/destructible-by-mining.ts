import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateNonEmptyString,
  validateNonNegativeNumber,
  validateNumber,
} from '@artifex/common/content/validation/content-validation';

import { DestructibleByMiningComponent } from '../interfaces/block-config';

export interface ItemSpecificSpeed {
  item: string;
  destroySpeed: number;
}

/**
 * Creates a destructible_by_mining component for Minecraft blocks
 */
export const createDestructibleByMining = (
  options?: boolean | DestructibleByMiningComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:destructible_by_mining': boolean | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'boolean') {
    return {
      'minecraft:destructible_by_mining': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    const result: any = {};

    if (options.secondsToDestroy !== undefined) {
      if (
        !validateNonNegativeNumber(
          options.secondsToDestroy,
          ctx,
          'Seconds to destroy must be a non-negative number',
          'secondsToDestroy',
        )
      ) {
        return undefined;
      }
      result.seconds_to_destroy = options.secondsToDestroy;
    }

    if (Array.isArray(options.itemSpecificSpeeds)) {
      result.item_specific_speeds = [];

      for (let index = 0; index < options.itemSpecificSpeeds.length; index++) {
        const entry = options.itemSpecificSpeeds[index];
        const entryContext =
          ctx !== undefined
            ? { ...ctx, fieldPath: `itemSpecificSpeeds[${index}]` }
            : undefined;

        if (typeof entry !== 'object' || entry === null) {
          logContentError(
            entryContext,
            'Item specific speed entries must be objects',
          );
          return undefined;
        }

        if (
          !validateNonEmptyString(
            entry.item,
            entryContext,
            'Item must be a non-empty string',
            'item',
          )
        ) {
          return undefined;
        }

        if (
          !validateNumber(
            entry.destroySpeed,
            entryContext,
            'Destroy speed must be a number',
            'destroySpeed',
          )
        ) {
          return undefined;
        }

        result.item_specific_speeds.push({
          item: entry.item,
          destroy_speed: entry.destroySpeed,
        });
      }
    }

    return {
      'minecraft:destructible_by_mining': result,
    };
  }

  logContentError(
    ctx,
    'Destructible by mining must be a boolean or an object with valid properties',
  );
  return undefined;
};
