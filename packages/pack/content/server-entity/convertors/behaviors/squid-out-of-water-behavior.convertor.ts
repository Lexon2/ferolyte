import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SquidOutOfWaterBehavior } from '../../interfaces/behaviors/squid-out-of-water-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SquidOutOfWaterBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSquidOutOfWaterBehavior = (
  behavior: Partial<SquidOutOfWaterBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.squid_out_of_water': any } | undefined => {
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

  return {
    'minecraft:behavior.squid_out_of_water': result
  };
};
