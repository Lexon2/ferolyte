import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FloatBehavior } from '../../interfaces/behaviors/float-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts a FloatBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFloatBehavior = (
  behavior: Partial<FloatBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.float': any } | undefined => {
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

  // Validate sinkWithPassengers
  if (behavior.sinkWithPassengers !== undefined) {
    if (!validateBoolean(behavior.sinkWithPassengers, 'sinkWithPassengers')) {
      return undefined;
    }
    result.sink_with_passengers = behavior.sinkWithPassengers;
  }

  return {
    'minecraft:behavior.float': result
  };
};
