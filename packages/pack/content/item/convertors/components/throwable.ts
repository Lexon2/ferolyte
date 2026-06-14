import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonNegativeNumber,
} from '@artifex/common/content/validation/content-validation';

interface ThrowableOptions {
  doSwingAnimation?: boolean;
  launchPowerScale?: number;
  maxDrawDuration?: number;
  minDrawDuration?: number;
  maxLaunchPower?: number;
  scalePowerByDrawDuration?: boolean;
}

/**
 * Creates a throwable component for Minecraft items
 * @param options The throwable options
 * @returns The throwable component in Minecraft format or undefined if validation fails
 */
export const createThrowable = (
  options?: ThrowableOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:throwable': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.doSwingAnimation !== undefined) {
    if (
      !validateBooleanValue(
        options.doSwingAnimation,
        ctx,
        'Do swing animation must be a boolean',
        'doSwingAnimation',
      )
    ) {
      return undefined;
    }
    result.do_swing_animation = options.doSwingAnimation;
  }

  if (options.launchPowerScale !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.launchPowerScale,
        ctx,
        'Launch power scale must be a positive number',
        'launchPowerScale',
      )
    ) {
      return undefined;
    }
    result.launch_power_scale = options.launchPowerScale;
  }

  if (options.maxDrawDuration !== undefined) {
    if (
      !validateNonNegativeNumber(
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

  if (options.minDrawDuration !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.minDrawDuration,
        ctx,
        'Min draw duration must be a non-negative number',
        'minDrawDuration',
      )
    ) {
      return undefined;
    }
    result.min_draw_duration = options.minDrawDuration;
  }

  if (options.maxLaunchPower !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.maxLaunchPower,
        ctx,
        'Max launch power must be a positive number',
        'maxLaunchPower',
      )
    ) {
      return undefined;
    }
    result.max_launch_power = options.maxLaunchPower;
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

  return {
    'minecraft:throwable': result,
  };
};
