import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OpenDoorBehavior } from '../../interfaces/behaviors/open-door-behavior';
import { validateBoolean, validateNumber } from '../common/validation';

/**
 * Converts an OpenDoorBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertOpenDoorBehavior = (
  behavior: Partial<OpenDoorBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.open_door': any } | undefined => {
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

  // Validate closeDoorAfter
  if (behavior.closeDoorAfter !== undefined) {
    if (!validateBoolean(behavior.closeDoorAfter, 'closeDoorAfter')) {
      return undefined;
    }
    result.close_door_after = behavior.closeDoorAfter;
  }

  return {
    'minecraft:behavior.open_door': result,
  };
};
