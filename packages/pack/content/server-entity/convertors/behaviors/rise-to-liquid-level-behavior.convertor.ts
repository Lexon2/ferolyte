import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RiseToLiquidLevelBehavior } from '../../interfaces/behaviors/rise-to-liquid-level-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a RiseToLiquidLevelBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRiseToLiquidLevelBehavior = (
  behavior: Partial<RiseToLiquidLevelBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.rise_to_liquid_level': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate liquidYOffset
  if (behavior.liquidYOffset !== undefined) {
    if (!validateNumber(behavior.liquidYOffset, 'liquidYOffset')) {
      return undefined;
    }
    result.liquid_y_offset = behavior.liquidYOffset;
  }

  // Validate riseDelta
  if (behavior.riseDelta !== undefined) {
    if (!validateNumber(behavior.riseDelta, 'riseDelta')) {
      return undefined;
    }
    result.rise_delta = behavior.riseDelta;
  }

  // Validate sinkDelta
  if (behavior.sinkDelta !== undefined) {
    if (!validateNumber(behavior.sinkDelta, 'sinkDelta')) {
      return undefined;
    }
    result.sink_delta = behavior.sinkDelta;
  }

  return {
    'minecraft:behavior.rise_to_liquid_level': result
  };
};
