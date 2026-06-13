import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { DoorInteractBehavior } from '../../interfaces/behaviors/door-interact-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DoorInteractBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDoorInteractBehavior = (
  behavior: Partial<DoorInteractBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.door_interact': any } | undefined => {
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
    'minecraft:behavior.door_interact': result
  };
};
