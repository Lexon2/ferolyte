import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DragonFlamingBehavior } from '../../interfaces/behaviors/dragon-flaming-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonFlamingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonFlamingBehavior = (
  behavior: Partial<DragonFlamingBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.dragonflaming': any } | undefined => {
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

  // Validate cooldownTime
  if (behavior.cooldownTime !== undefined) {
    if (!validateNumber(behavior.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = behavior.cooldownTime;
  }

  // Validate flameTime
  if (behavior.flameTime !== undefined) {
    if (!validateNumber(behavior.flameTime, 'flameTime')) {
      return undefined;
    }
    result.flame_time = behavior.flameTime;
  }

  // Validate groundFlameCount
  if (behavior.groundFlameCount !== undefined) {
    if (!validateNumber(behavior.groundFlameCount, 'groundFlameCount')) {
      return undefined;
    }
    result.ground_flame_count = behavior.groundFlameCount;
  }

  // Validate roarTime
  if (behavior.roarTime !== undefined) {
    if (!validateNumber(behavior.roarTime, 'roarTime')) {
      return undefined;
    }
    result.roar_time = behavior.roarTime;
  }

  return {
    'minecraft:behavior.dragonflaming': result,
  };
};
