import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DragonTakeoffBehavior } from '../../interfaces/behaviors/dragon-takeoff-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonTakeoffBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonTakeoffBehavior = (
  behavior: Partial<DragonTakeoffBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.dragontakeoff': any } | undefined => {
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
    'minecraft:behavior.dragontakeoff': result
  };
};
