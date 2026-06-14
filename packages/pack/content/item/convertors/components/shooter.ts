import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@artifex/common/content/validation/content-validation';

interface AmmunitionItem {
  item: string;
  useOffhand?: boolean;
  searchInventory?: boolean;
  useInCreative?: boolean;
}

interface ShooterOptions {
  ammunition?: AmmunitionItem[];
  chargeOnDraw?: boolean;
  maxDrawDuration?: number;
  scalePowerByDrawDuration?: boolean;
}

/**
 * Creates a shooter component for Minecraft items
 * @param options The shooter options
 * @returns The shooter component in Minecraft format or undefined if validation fails
 */
export const createShooter = (
  options?: ShooterOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:shooter': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.ammunition) && options.ammunition.length > 0) {
    const ammunition: Record<string, unknown>[] = [];

    for (let index = 0; index < options.ammunition.length; index++) {
      const ammo = options.ammunition[index];
      const ammoContext =
        ctx !== undefined
          ? { ...ctx, fieldPath: `ammunition[${index}]` }
          : undefined;

      if (
        !validateNonEmptyString(
          ammo.item,
          ammoContext,
          'Ammunition item must be a non-empty string',
          'item',
        )
      ) {
        return undefined;
      }

      const ammoResult: Record<string, unknown> = { item: ammo.item };

      if (ammo.useOffhand !== undefined) {
        if (
          !validateBooleanValue(
            ammo.useOffhand,
            ammoContext,
            'Use offhand must be a boolean',
            'useOffhand',
          )
        ) {
          return undefined;
        }
        ammoResult.use_offhand = ammo.useOffhand;
      }

      if (ammo.searchInventory !== undefined) {
        if (
          !validateBooleanValue(
            ammo.searchInventory,
            ammoContext,
            'Search inventory must be a boolean',
            'searchInventory',
          )
        ) {
          return undefined;
        }
        ammoResult.search_inventory = ammo.searchInventory;
      }

      if (ammo.useInCreative !== undefined) {
        if (
          !validateBooleanValue(
            ammo.useInCreative,
            ammoContext,
            'Use in creative must be a boolean',
            'useInCreative',
          )
        ) {
          return undefined;
        }
        ammoResult.use_in_creative = ammo.useInCreative;
      }

      ammunition.push(ammoResult);
    }

    result.ammunition = ammunition;
  }

  if (options.chargeOnDraw !== undefined) {
    if (
      !validateBooleanValue(
        options.chargeOnDraw,
        ctx,
        'Charge on draw must be a boolean',
        'chargeOnDraw',
      )
    ) {
      return undefined;
    }
    result.charge_on_draw = options.chargeOnDraw;
  }

  if (options.maxDrawDuration !== undefined) {
    if (
      !validatePositiveNumber(
        options.maxDrawDuration,
        ctx,
        'Max draw duration must be a positive number',
        'maxDrawDuration',
      )
    ) {
      return undefined;
    }
    result.max_draw_duration = options.maxDrawDuration;
  }

  if (options.scalePowerByDrawDuration !== undefined) {
    if (
      !validateBooleanValue(
        options.scalePowerByDrawDuration,
        ctx,
        'Scale power by draw duration must be a boolean',
        'scalePowerByDrawDuration',
      )
    ) {
      return undefined;
    }
    result.scale_power_by_draw_duration = options.scalePowerByDrawDuration;
  }

  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return {
    'minecraft:shooter': result,
  };
};
